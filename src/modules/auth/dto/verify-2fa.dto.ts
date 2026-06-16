// dto/verify-2fa.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class Verify2FADto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'user', required: false })
  @IsOptional()
  @IsString()
  accountType?: 'user' | 'admin';
}
