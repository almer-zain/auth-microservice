// guards/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSIONS } from 'src/common/decorator/permissions.decorator';
import { JwtPayload } from 'src/common/types/jwt-types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();
    const user = request.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException('No permissions assigned');
    }

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

/**
How to use in Controller 

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard) // Apply both
export class UsersController {
  
  @Get()
  @Permissions('users.view') // Dynamic permission check
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @Permissions('users.delete', 'admin.only') // Multiple permissions
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
 */
