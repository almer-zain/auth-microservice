import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  /**
   * Creates a new security role and associates initial permissions.
   *
   * @param dto - Role definition and associated permission IDs
   * @returns The created Role entity
   * @throws ConflictException if the role name already exists
   */
  async create(dto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepo.findOne({ where: { name: dto.name } });
    if (exists) {
      this.logger.warn(`Role creation conflict: ${dto.name} already exists`);
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.roleRepo.create({ name: dto.name });
    if (dto.permissionIds && dto.permissionIds.length > 0) {
      role.permissions = await this.permissionRepo.findBy({
        id: In(dto.permissionIds),
      });
    }
    const saved = await this.roleRepo.save(role);
    this.logger.log(`Role created: ${saved.name} (ID: ${saved.id})`);
    return saved;
  }

  /**
   * Retrieves a paginated list of roles including their assigned permissions.
   *
   * @param query - Pagination parameters
   * @returns Paginated roles with metadata
   */
  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await this.roleRepo.findAndCount({
      relations: ['permissions'],
      skip,
      take: limit,
      order: { id: 'ASC' },
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
   * Fetches a single role by ID with its permission set.
   *
   * @param id - Role primary key
   * @returns The Role entity
   * @throws NotFoundException if the role is not found
   */
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      this.logger.error(`Lookup failed: Role ID ${id} not found`);
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  /**
   * Updates role metadata or permission mappings.
   *
   * @param id - Target role ID
   * @param dto - Update data
   * @returns The updated Role entity
   */
  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (dto.name && dto.name !== role.name) {
      const exists = await this.roleRepo.findOne({ where: { name: dto.name } });
      if (exists) {
        throw new ConflictException('Role name already taken');
      }
      role.name = dto.name;
    }

    if (dto.permissionIds) {
      role.permissions = await this.permissionRepo.findBy({
        id: In(dto.permissionIds),
      });
    }

    const updated = await this.roleRepo.save(role);
    this.logger.log(`Role updated: ID ${id} (${updated.name})`);
    return updated;
  }

  /**
   * Permanently removes a role from the system.
   * Note: This will cascade to the roles_permissions join table.
   *
   * @param id - Target role ID
   */
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepo.remove(role);
    this.logger.warn(`Role deleted: ID ${id} (${role.name})`);
  }
}
