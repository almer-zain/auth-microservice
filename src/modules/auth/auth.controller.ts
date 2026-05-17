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

  @MessagePattern('auth.login')
  login(@Payload() data: any) {
    return this.authService.login(data);
  }

  @MessagePattern('auth.generate2FA')
  generate2FA(@Payload() userId: number) {
    return this.authService.generate2FASecret(userId);
  }

  @MessagePattern('auth.verify2FA')
  verify2FA(@Payload() data: { userId: number; token: string }) {
    return this.authService.verify2FA(data.userId, data.token);
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