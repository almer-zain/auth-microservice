import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminsService } from './admins.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor) // Crucial to hide the password and 2FA secrets
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @MessagePattern('admin.create')
  create(@Payload() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @MessagePattern('admin.findAll')
  findAll() {
    return this.adminsService.findAll();
  }

  @MessagePattern('admin.findOne')
  findOne(@Payload() id: number) {
    return this.adminsService.findOne(id);
  }

  @MessagePattern('admin.update')
  update(@Payload() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(updateAdminDto.id, updateAdminDto);
  }

  @MessagePattern('admin.remove')
  remove(@Payload() id: number) {
    return this.adminsService.remove(id);
  }
}