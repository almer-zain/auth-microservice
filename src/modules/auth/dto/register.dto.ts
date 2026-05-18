import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { IsValidUsername } from 'src/utils/auth-decorator';

export class RegisterDto {
  @ApiProperty()
  @IsValidUsername()
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