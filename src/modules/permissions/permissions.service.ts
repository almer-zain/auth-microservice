import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const exists = await this.permissionRepo.findOne({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException('Permission name already exists');

    const permission = this.permissionRepo.create(dto);
    const saved = await this.permissionRepo.save(permission);

    this.logger.log(`Permission created: ${saved.name} (ID: ${saved.id})`);
    return saved;
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await this.permissionRepo.findAndCount({
      skip,
      take: limit,
      order: { name: 'ASC' }, // Permissions usually sorted alphabetically
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

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException(`Permission #${id} not found`);
    return permission;
  }

  async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id);

    if (dto.name && dto.name !== permission.name) {
      const exists = await this.permissionRepo.findOne({
        where: { name: dto.name },
      });
      if (exists) throw new ConflictException('Permission name already taken');
    }

    Object.assign(permission, dto);
    const updated = await this.permissionRepo.save(permission);

    this.logger.log(`Permission updated: ID ${id}`);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepo.remove(permission);
    this.logger.warn(`Permission deleted: ID ${id} (${permission.name})`);
  }
}
