import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @Matches(/^(?!.*[._]{2})[a-zA-Z0-9](?:[a-zA-Z0-9._]{6,30})[a-zA-Z0-9]$/, {
    message:
      'Username must be 8-32 chars, alphanumeric, and may contain . or _ only',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  displayUsername: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;
}

export class LoginDto extends RegisterDto {}