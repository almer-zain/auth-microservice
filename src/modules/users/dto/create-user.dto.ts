import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { transformEmail, transformTrim } from 'src/utils/sanitize.util';

export class CreateUserDto {
  @ApiProperty() // For Swagger docs
  @IsString()
  @IsNotEmpty()
  @Transform(transformTrim) // Cleans whitespace from user entry paths
  username: string;

  @ApiProperty()
  @IsEmail()
  @Transform(transformEmail) // Trims and forces email to lowercase uniformly
  email: string;
}
