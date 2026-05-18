import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  usernameDisplay: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  // Expecting an array of Role IDs to assign to the admin
  @ApiProperty()
  @IsArray()
  @IsOptional()
  roleIds?: number[]; 
}