import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // Added 'readonly' to enforce immutability
  ) {}

  /**
   * Registers a new user in the system after validating uniqueness.
   * Checks for duplicate email or username using an OR condition strategy.
   *
   * @param dto Data transfer object containing registration details
   * @returns The newly created and persisted User entity
   * @throws {ConflictException} If the email or username is already registered
   */
  async create(dto: CreateUserDto): Promise<User> {
    // DEV INFO: Passing an array of objects to 'where' tells TypeORM to generate an 'OR' SQL clause.
    const existing = await this.usersRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existing) {
      this.logger.warn(
        `User creation conflict: ${dto.email} or ${dto.username}`,
      );
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // DEV INFO: .create() only instantiates the entity instance in memory.
    // It triggers entity lifecycle hooks (like @BeforeInsert for password hashing) before .save() runs.
    const newUser = this.usersRepository.create(dto);
    const savedUser = await this.usersRepository.save(newUser);

    this.logger.log(`User successfully created with ID: ${savedUser.id}`);
    return savedUser;
  }

  /**
   * Retrieves a paginated list of users ordered by newest registration.
   *
   * @param query Pagination parameters containing page and limit bounds
   * @returns Object containing the data array and structured pagination metadata
   */
  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // DEV INFO: findAndCount executes two separate SQL queries concurrently (SELECT and COUNT).
    const [items, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  /**
   * Fetches a specific user by their database Primary Key.
   *
   * @param id The unique integer ID of the user
   * @returns The matching User entity
   * @throws {NotFoundException} If no user matches the provided ID
   */
  async findOne(id: number): Promise<User> {
    // DEV INFO: findOneBy is optimized and performs faster than findOne({ where }) for primary keys.
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      this.logger.error(`User lookup failed: ID ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates an existing user's profile information dynamically.
   * Safeguards against email or username theft by checking other database records.
   *
   * @param id The unique integer ID of the user to update
   * @param dto Partial update dataset
   * @returns The updated User entity instance
   * @throws {ConflictException} If the new email or username is already taken by another user
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email || dto.username) {
      // DEV INFO: Conditional spread `...(condition && {key: value})` prevents sending
      // 'undefined' keys to TypeORM, which would corrupt the evaluation criteria.
      const conflict = await this.usersRepository.findOne({
        where: [
          { ...(dto.email && { email: dto.email }), id: Not(id) },
          { ...(dto.username && { username: dto.username }), id: Not(id) },
        ],
      });
      if (conflict) {
        throw new ConflictException(
          'Email or Username already taken by another user',
        );
      }
    }

    // DEV INFO: Object.assign mutates the properties of the database-fetched entity safely.
    // This allows .save() to perform an efficient SQL UPDATE statement instead of a raw INSERT.
    Object.assign(user, dto);
    const updated = await this.usersRepository.save(user);
    this.logger.log(`User updated successfully: ID ${id}`);
    return updated;
  }

  /**
   * Deletes a user record permanently from the system (Hard Delete).
   *
   * @param id The unique integer ID of the user to delete
   * @throws {NotFoundException} If the target user record does not exist
   */
  async remove(id: number): Promise<void> {
    // DEV INFO: Running .delete() directly avoids an initial SELECT query, saving database resources.
    // Validity of the operation is evaluated post-execution using the 'affected' row counter.
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.warn(`User hard-deleted from database: ID ${id}`);
  }
}
