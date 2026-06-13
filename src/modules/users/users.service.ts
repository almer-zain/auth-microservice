import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ----------------------------------------------------------------
  // Create User
  // ----------------------------------------------------------------
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  // ----------------------------------------------------------------
  // Find All User
  // ----------------------------------------------------------------
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // ----------------------------------------------------------------
  // Find One User
  // ----------------------------------------------------------------
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // ----------------------------------------------------------------
  // Update User
  // ----------------------------------------------------------------
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Checks if user exists
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.usersRepository.save(updatedUser);
  }

  // ----------------------------------------------------------------
  // Remove User
  // ----------------------------------------------------------------
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
