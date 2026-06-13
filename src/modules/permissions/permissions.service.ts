import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const exists = await this.permissionRepo.findOne({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException('Permission already exists');

    const permission = this.permissionRepo.create(dto);
    return this.permissionRepo.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepo.find();
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
    return this.permissionRepo.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepo.remove(permission);
  }
}
