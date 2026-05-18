import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService], // Export in case AuthModule needs to verify admins
})
export class AdminsModule {}