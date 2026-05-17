import { PartialType } from '@nestjs/swagger'; // Changed from @nestjs/mapped-types
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}