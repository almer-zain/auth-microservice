import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor) // Activates the @Exclude() in your Entity
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  register(@Payload() data: any) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.admin.login')
  adminLogin(@Payload() data: any) {
    return this.authService.login(data, 'admin'); // It will now look in the admins table!
  }

  @MessagePattern('auth.user.login')
  userLogin(@Payload() data: any) {
    return this.authService.login(data); // Defaults to 'user', looks in users table!
  }
  
  @MessagePattern('auth.generate2FA')
  generate2FA(@Payload() userId: number) {
    return this.authService.generate2FASecret(userId);
  }

  @MessagePattern('auth.verify2FA')
  verify2FA(@Payload() data: { userAgent: any, userId: number; token: string }) {
    return this.authService.verify2FA(data.userAgent, data.userId, data.token);
  }

  @MessagePattern('auth.forgotPassword')
  forgotPassword(@Payload() email: string) {
    return this.authService.forgotPassword(email);
  }

  @MessagePattern('auth.resetPassword')
  resetPassword(@Payload() data: any) {
    return this.authService.resetPassword(data);
  }
}