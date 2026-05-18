import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { password, roleIds, ...rest } = createAdminDto;

    // Check for existing email/username
    const existing = await this.adminsRepository.findOne({ 
        where: [{ email: rest.email }, { username: rest.username }] 
    });
    if (existing) throw new ConflictException('Admin already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Map roleIds [1, 2] to [{id: 1}, {id: 2}] for TypeORM ManyToMany saving
    const roles = roleIds ? roleIds.map(id => ({ id })) : [];

    const newAdmin = this.adminsRepository.create({
      ...rest,
      password: hashedPassword,
      roles,
    });

    return this.adminsRepository.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    // Load the roles and their permissions
    return this.adminsRepository.find({ relations: ['roles', 'roles.permissions'] });
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminsRepository.findOne({ 
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
    
    if (!admin) throw new NotFoundException(`Admin #${id} not found`);
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
      admin.roles = roleIds.map(roleId => ({ id: roleId })) as any;
    }

    // Merge standard properties
    Object.assign(admin, rest);

    return this.adminsRepository.save(admin);
  }

  async remove(id: number): Promise<void> {
    const result = await this.adminsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
  }
}