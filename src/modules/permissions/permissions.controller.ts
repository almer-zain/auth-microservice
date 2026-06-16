import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PermissionsController {
  constructor(private readonly PermissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new system permission identifier' })
  create(@Body() dto: CreatePermissionDto) {
    return this.PermissionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve paginated list of permissions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Returns a paginated list of permissions and metadata',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.PermissionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch permission details by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.PermissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify permission string or description' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.PermissionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently remove a system permission' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.PermissionsService.remove(id);
  }
}
