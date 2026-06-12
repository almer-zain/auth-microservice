import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export interface Verify2FAPayload {
  userAgent?: string;
  ip?: string;
  userId: number;
  token: string;
}

@Controller()
@UseInterceptors(ClassSerializerInterceptor) // Activates the @Exclude() in your Entity
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register')
  register(@Payload() data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.admin.login')
  adminLogin(@Payload() data: LoginDto) {
    return this.authService.login(data, 'admin');
  }

  @MessagePattern('auth.user.login')
  userLogin(@Payload() data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern('auth.generate2FA')
  generate2FA(@Payload() userId: number) {
    return this.authService.generate2FASecret(userId);
  }

  @MessagePattern('auth.verify2FA')
  verify2FA(@Payload() data: Verify2FAPayload) {
    return this.authService.verify2FA(data, data.userId, data.token);
  }

  @MessagePattern('auth.forgotPassword')
  forgotPassword(@Payload() email: string) {
    return this.authService.forgotPassword(email);
  }

  @MessagePattern('auth.resetPassword')
  resetPassword(@Payload() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
