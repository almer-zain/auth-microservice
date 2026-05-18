import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDevice } from './entities/account-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountDevice])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
