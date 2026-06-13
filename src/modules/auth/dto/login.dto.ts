import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformEmail, transformTrim } from 'src/utils/sanitize.util';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @Transform(transformEmail) // Normalizes to lowercase and trims securely
  email: string;

  @ApiProperty()
  @IsString()
  password: string; // Left untouched to preserve exact special characters/spaces

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(transformTrim) // Prevents trailing/leading accidental white space issues
  captchaToken?: string;

  @IsOptional()
  @IsString()
  @Transform(transformTrim)
  ip?: string;

  @IsOptional()
  @IsString()
  @Transform(transformTrim)
  userAgent?: string;
}
