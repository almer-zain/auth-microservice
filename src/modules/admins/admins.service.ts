import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  /**
   * Provisions a new administrative account.
   * Validates identity uniqueness and hashes credentials before persistence.
   *
   * @param dto - Admin creation data including role assignments
   * @returns The persisted Admin entity
   * @throws ConflictException if email or username is already registered
   */
  async create(dto: CreateAdminDto): Promise<Admin> {
    const { password, roleIds, ...rest } = dto;

    const existing = await this.adminsRepository.findOne({
      where: [{ email: rest.email }, { username: rest.username }],
    });

    if (existing) {
      this.logger.warn(
        `Admin provision failed: Identity conflict for ${rest.email}`,
      );
      throw new ConflictException(
        'Admin with this email or username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const roles = roleIds ? roleIds.map((id) => ({ id }) as Role) : [];

    const newAdmin = this.adminsRepository.create({
      ...rest,
      password: hashedPassword,
      roles,
    });

    const savedAdmin = await this.adminsRepository.save(newAdmin);
    this.logger.log(`Admin created successfully: ID ${savedAdmin.id}`);
    return savedAdmin;
  }

  /**
   * Retrieves a paginated list of administrators.
   * Includes nested relations for roles and their associated permissions.
   *
   * @param query - Pagination and limit parameters
   * @returns Paginated result set with metadata
   */
  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await this.adminsRepository.findAndCount({
      relations: ['roles', 'roles.permissions'],
      skip,
      take: limit,
      order: { id: 'DESC' },
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
   * Fetches a specific administrator by primary key.
   *
   * @param id - Unique identifier of the admin
   * @returns The admin entity with full permission tree
   * @throws NotFoundException if the admin does not exist
   */
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!admin) {
      this.logger.error(`Read operation failed: Admin ID ${id} not found`);
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  /**
   * Updates administrative account details and security roles.
   *
   * @param id - Target admin ID
   * @param dto - Partial update data
   * @returns The updated Admin entity
   */
  async update(id: number, dto: UpdateAdminDto): Promise<Admin> {
    const { password, roleIds, ...rest } = dto;
    const admin = await this.findOne(id);

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    if (roleIds) {
      admin.roles = roleIds.map((roleId) => ({ id: roleId }) as Role);
    }

    Object.assign(admin, rest);
    const updated = await this.adminsRepository.save(admin);

    this.logger.log(`Admin updated successfully: ID ${id}`);
    return updated;
  }

  /**
   * Performs a privacy-compliant soft delete.
   * Overwrites sensitive identifiers (PII) before marking the record as deleted.
   *
   * @param id - Target admin ID
   * @throws NotFoundException if admin does not exist
   */
  async remove(id: number): Promise<void> {
    const admin = await this.findOne(id);

    // Scrubbing PII for data retention compliance
    admin.email = `deleted-admin-${id}@internal.system`;
    admin.username = `deleted_admin_${id}`;
    admin.displayName = 'Deleted Admin';
    admin.password = 'SCRUBBED';
    admin.isTwoFactorEnabled = false;
    admin.twoFactorSecret = null;

    // Persist scrubbed state then soft-remove
    await this.adminsRepository.save(admin);
    await this.adminsRepository.softRemove(admin);

    this.logger.warn(`Admin record scrubbed and soft-deleted: ID ${id}`);
  }
}
