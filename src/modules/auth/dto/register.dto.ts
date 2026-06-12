import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsValidUsername } from 'src/utils/auth-decorator';
import sanitize from 'sanitize-html';

export class RegisterDto {
  @ApiProperty()
  @IsValidUsername()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim() : (value as unknown),
  )
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) =>
    sanitize(value, { allowedTags: [], allowedAttributes: {} }).trim(),
  )
  displayUsername: string;

  @ApiProperty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) =>
    typeof value === 'string' ? value.trim().toLowerCase() : (value as unknown),
  )
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  captchaToken?: string;
}
