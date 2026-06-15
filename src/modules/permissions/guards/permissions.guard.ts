import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSIONS } from 'src/common/decorator/permissions.decorator';
import { RequestWithUser } from 'src/common/types/jwt-types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_PERMISSIONS,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    // Fix: Explicitly type the request to avoid 'any' assignment
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // user.permissions is now safely typed based on your JwtPayload interface
    if (!user || !user.permissions) {
      throw new ForbiddenException('No permissions assigned to this account');
    }

    const hasPermission = requiredPermissions.every((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
