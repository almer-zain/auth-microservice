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
    private adminsRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { password, roleIds, ...rest } = createAdminDto;

    // Check for existing email/username
    const existing = await this.adminsRepository.findOne({
      where: [{ email: rest.email }, { username: rest.username }],
    });

    if (existing) {
      this.logger.warn(`Admin creation failed: ${rest.email} already exists`);
      throw new ConflictException('Admin already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Map roleIds [1, 2] to [{id: 1}, {id: 2}] for TypeORM ManyToMany saving
    const roles = roleIds ? roleIds.map((id) => ({ id })) : [];

    const newAdmin = this.adminsRepository.create({
      ...rest,
      password: hashedPassword,
      roles,
    });

    const savedAdmin = await this.adminsRepository.save(newAdmin);
    this.logger.log(`Admin created successfully: ID ${savedAdmin.id}`);
    return savedAdmin;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await this.adminsRepository.findAndCount({
      relations: ['roles', 'roles.permissions'],
      skip,
      take: limit,
      order: { id: 'DESC' },
    });

    this.logger.log(`Retrieved ${items.length} admins (Total: ${total})`);

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

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!admin) {
      this.logger.error(`Admin lookup failed: ID ${id} not found`);
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const { password, roleIds, ...rest } = updateAdminDto;
    const admin = await this.findOne(id); // Ensures it exists

    // If updating password, hash it
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    // If updating roles, map them

    if (roleIds) {
      admin.roles = roleIds.map((roleId) => {
        const role = new Role();
        role.id = roleId;
        return role;
      });
    }
    // Merge standard properties

    Object.assign(admin, rest);
    const updated = await this.adminsRepository.save(admin);

    this.logger.log(`Admin updated: ID ${id}`);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.adminsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    this.logger.log(`Admin deleted: ID ${id}`);
  }
}
