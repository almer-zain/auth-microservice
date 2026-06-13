import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsValidUsername } from 'src/utils/auth-decorator.util';
import {
  transformEmail,
  transformSanitizeHtml,
  transformTrim,
} from 'src/utils/sanitize.util';

export class RegisterDto {
  @ApiProperty()
  @IsValidUsername()
  @Transform(transformTrim) // 💡 Clean & readable!
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(transformSanitizeHtml) // 💡 No complex nested arrow functions!
  displayUsername: string;

  @ApiProperty()
  @IsEmail()
  @Transform(transformEmail) // 💡 Centralized email validation logic
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  captchaToken?: string;
}
