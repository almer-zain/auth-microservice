import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login/admin')
  @ApiOperation({ summary: 'Admin login' })
  adminLogin(
    @Body() data: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.authService.login({ ...data, ip, userAgent: ua }, 'admin');
  }

  @Post('login/user')
  @ApiOperation({ summary: 'User login' })
  userLogin(
    @Body() data: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.authService.login({ ...data, ip, userAgent: ua }, 'user');
  }

  @Post('2fa/generate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate 2FA Secret' })
  generate2FA(@Body('userId') userId: number) {
    return this.authService.generate2FASecret(userId);
  }

  @Post('2fa/verify')
  @ApiOperation({ summary: 'Verify 2FA Token' })
  verify2FA(
    @Body() data: Verify2FADto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    return this.authService.verify2FA(data, ip, ua);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with code' })
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
