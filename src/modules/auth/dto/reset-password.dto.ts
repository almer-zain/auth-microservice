import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Match } from 'src/utils/auth-decorator.util';
import { transformEmail, transformTrim } from 'src/utils/sanitize.util';

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @Transform(transformEmail) // Normalizes email consistently
  email: string;

  @ApiProperty()
  @IsString()
  @Transform(transformTrim) // Cleans whitespace from authentication code paste operations
  code: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Match('newPassword', {
    // Changed target string from 'password' to 'newPassword'
    message: 'Passwords do not match',
  })
  confirmPassword: string;
}
