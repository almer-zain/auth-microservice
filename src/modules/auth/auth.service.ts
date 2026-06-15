import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { generateSecret, generateURI, verify } from 'otplib';
import * as QRCode from 'qrcode';
import type { ConfigService, ConfigType } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { Admin } from '../admins/entities/admin.entity';
import { MailService } from '../mail/mail.service';
import { CaptchaService } from './captcha.service';
import { DeviceService } from './device.service';
import jwtConfig from 'src/config/namespaces/jwt.config';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AccountWithRoles } from '../roles/entities/role.entity';
import { getErrorStack } from 'src/utils/error.util';
import { Verify2FADto } from './dto/verify-2fa.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>, // <-- Added

    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private captchaService: CaptchaService,
    private deviceService: DeviceService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof jwtConfig>,
  ) {}

  // --- DYNAMIC REPO HELPER ---
  // Picks the correct database table dynamically
  private getRepo(type: 'user' | 'admin') {
    return type === 'admin' ? this.adminRepository : this.userRepository;
  }

  // ----------------------------------------------------------------
  // Register
  // ----------------------------------------------------------------

  async register(data: RegisterDto, accountType: 'user' | 'admin' = 'user') {
    await this.captchaService.verify(data.captchaToken);
    const repo = this.getRepo(accountType);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const account = repo.create({
      ...data,
      password: hashedPassword,
    });

    return repo.save(account);
  }

  // ----------------------------------------------------------------
  // Login
  // ----------------------------------------------------------------
  async login(data: LoginDto, accountType: 'user' | 'admin' = 'user') {
    await this.captchaService.verify(data.captchaToken, data.ip);
    const repo = this.getRepo(accountType);

    const account = await repo.findOne({
      where: { email: data.email },
      select: ['id', 'email', 'password', 'isTwoFactorEnabled'],
      relations: ['roles', 'roles.permissions'],
    });

    if (!account || !(await bcrypt.compare(data.password, account.password))) {
      this.logger.warn(`Failed login attempt for email: ${data.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (account.isTwoFactorEnabled) {
      return { mfaRequired: true, userId: account.id, accountType };
    }

    // Process device check in background
    this.deviceService
      .checkAndAlert(
        account.id,
        accountType,
        account.email,
        data.ip,
        data.userAgent,
      )
      .catch((error) =>
        this.logger.error(
          `Device check failed for ${account.email}`,
          getErrorStack(error),
        ),
      );

    this.logger.log(`User logged in: ${account.email}`);
    return await this.generateTokens(account);
  }

  // ----------------------------------------------------------------
  // Generate 2FA Secret
  // ----------------------------------------------------------------
  async generate2FASecret(
    userId: number,
    accountType: 'user' | 'admin' = 'user',
  ) {
    const repo = this.getRepo(accountType);

    const account = await repo.findOneBy({
      id: userId,
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const secret = generateSecret();

    const uri = generateURI({
      issuer: 'AuthService',
      label: account.email,
      secret,
    });

    const qrCode = await QRCode.toDataURL(uri);

    await repo.update(userId, {
      twoFactorSecret: secret,
    });

    return {
      secret,
      qrCode,
      uri,
    };
  }

  // ----------------------------------------------------------------
  // Verify 2FA
  // ----------------------------------------------------------------
  async verify2FA(data: Verify2FADto, ip: string, userAgent: string) {
    const { userId, token, accountType = 'user' } = data;
    const repo = this.getRepo(accountType);

    const account = await repo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!account || !account.twoFactorSecret) {
      throw new UnauthorizedException('2FA not initialized');
    }

    const isValid = await verify({ secret: account.twoFactorSecret, token });
    if (!isValid) {
      this.logger.warn(`Invalid 2FA token provided for user ID: ${userId}`);
      throw new UnauthorizedException('Invalid 2FA token');
    }

    await repo.update(userId, { isTwoFactorEnabled: true });

    this.deviceService
      .checkAndAlert(account.id, accountType, account.email, ip, userAgent)
      .catch((error) =>
        this.logger.error(`Device check failed`, getErrorStack(error)),
      );

    return await this.generateTokens(account);
  }

  // ----------------------------------------------------------------
  // Forgot Password
  // ----------------------------------------------------------------
  async forgotPassword(email: string, accountType: 'user' | 'admin' = 'user') {
    const repo = this.getRepo(accountType);
    const account = await repo.findOneBy({ email });

    if (!account) return { message: 'If email exists, code sent' };

    const token = crypto.randomBytes(32).toString('hex');

    const shortCode = token.substring(0, 6).toUpperCase();

    const expires = new Date(
      Date.now() + this.configService.get<number>('EXPIRY_EMAIL')!,
    );

    await repo.update(account.id, {
      passwordResetCode: token, // Store the full long token
      passwordResetExpires: expires,
    });

    // Construct the Frontend URL
    // Ensure 'FRONTEND_URL' is in your .env (e.g., https://my-app.com)
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${email}`;

    await this.mailService.sendPasswordResetEmail(email, shortCode, resetUrl);

    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    return isDev
      ? { message: 'Reset link generated', token, resetUrl }
      : { message: 'Reset link sent' };
  }

  // ----------------------------------------------------------------
  // Reset Password
  // ----------------------------------------------------------------
  async resetPassword(
    data: ResetPasswordDto,
    accountType: 'user' | 'admin' = 'user',
  ) {
    const repo = this.getRepo(accountType);
    const account = await repo.findOneBy({
      email: data.email,
      passwordResetCode: data.code,
    });

    if (
      !account ||
      !account.passwordResetExpires ||
      account.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired code');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await repo.update(account.id, {
      password: hashedPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
    });

    return { message: 'Password updated successfully' };
  }

  // ----------------------------------------------------------------
  // Generate JWT Token
  // ----------------------------------------------------------------
  async generateTokens(account: User | Admin) {
    // Force TypeScript to recognize the structure gracefully without "any"
    const accountWithRoles = account as unknown as AccountWithRoles;

    const permissions: string[] = accountWithRoles.roles
      ? accountWithRoles.roles
          .flatMap((r) => r.permissions ?? [])
          .map((p) => p?.name)
          .filter((name): name is string => !!name)
      : [];

    const payload = {
      sub: account.id,
      email: account.email,
      type: this.checkAdminOrUser(account),
      permissions: Array.from(new Set(permissions)),
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConf.accessSecret,
      expiresIn: this.jwtConf.accessExpiry,
    } as JwtSignOptions);

    const refreshToken = await this.jwtService.signAsync({ sub: account.id }, {
      secret: this.jwtConf.refreshSecret,
      expiresIn: this.jwtConf.refreshExpiry,
    } as JwtSignOptions);

    return { accessToken, refreshToken };
  }

  // Moved inside the class as a private method
  private checkAdminOrUser(account: User | Admin): string {
    return account instanceof Admin ? 'admin' : 'user';
  }
}
