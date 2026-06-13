import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) // Make sure to import TypeOrmModule.forFeature([Role, Permission]) in RoleModule
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Role already exists');

    const role = this.roleRepo.create({ name: dto.name });

    if (dto.permissionIds && dto.permissionIds.length > 0) {
      role.permissions = await this.permissionRepo.findBy({
        id: In(dto.permissionIds),
      });
    }

    return this.roleRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException(`Role #${id} not found`);
    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (dto.name && dto.name !== role.name) {
      const exists = await this.roleRepo.findOne({ where: { name: dto.name } });
      if (exists) throw new ConflictException('Role name already taken');
      role.name = dto.name;
    }

    if (dto.permissionIds) {
      role.permissions = await this.permissionRepo.findBy({
        id: In(dto.permissionIds),
      });
    }

    return this.roleRepo.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepo.remove(role);
  }
}
