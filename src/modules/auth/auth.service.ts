import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Admin } from '../admins/entities/admin.entity';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { JwtService } from '@nestjs/jwt';

import {
  generateSecret,
  generateURI,
  verify,
} from 'otplib';

import * as QRCode from 'qrcode';
import { generateToken } from 'src/utils/jwt';
import { MailService } from '../mail/mail.service';
import { AppService } from 'src/app.service';
import { CaptchaService } from './captcha.service';
import { DeviceService } from './device.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>, // <-- Added

    private jwtService: JwtService,
    private mailService: MailService,
    private appService: AppService,
    private captchaService: CaptchaService,
    private deviceService: DeviceService, 
  ) {}

  // --- DYNAMIC REPO HELPER ---
  // Picks the correct database table dynamically
  private getRepo(type: 'user' | 'admin') {
    return type === 'admin' ? this.adminRepository : this.userRepository;
  }

  // ----------------------------------------------------------------
  // Register
  // ----------------------------------------------------------------

  async register(data: any, accountType: 'user' | 'admin' = 'user') {

    await this.captchaService.verify(data.captchaToken);
    
    const repo = this.getRepo(accountType);

    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );

    const account = repo.create({
      ...data,
      password: hashedPassword,
    });

    return repo.save(account);
  }

  // ----------------------------------------------------------------
  // Login
  // ----------------------------------------------------------------
  async login(data: any, accountType: 'user' | 'admin' = 'user') {

    await this.captchaService.verify(data.captchaToken);

    const repo = this.getRepo(accountType);

    // Because password has `select: false` in the Entity, 
    // we must explicitly select it here, otherwise bcrypt will fail!
    const account = await repo.findOne({
      where: { email: data.email },
      select: ['id', 'email', 'password', 'isTwoFactorEnabled'], 
      relations: ['roles', 'roles.permissions'], // Needed so generateToken has permissions!
    });

    if (
      !account ||
      !(await bcrypt.compare(
        data.password,
        account.password,
      ))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (account.isTwoFactorEnabled) {
      return {
        mfaRequired: true,
        userId: account.id,
      };
    }

    this.deviceService.checkAndAlert(
      account.id, 
      accountType, 
      account.email, 
      data.ip, 
      data.userAgent
    ).catch(err => console.error('Device check failed', err));


    return await generateToken(account);
  }

  // ----------------------------------------------------------------
  // Generate 2FA Secret
  // ----------------------------------------------------------------
  async generate2FASecret(userId: number, accountType: 'user' | 'admin' = 'user') {
    
    const repo = this.getRepo(accountType);

    const account = await repo.findOneBy({
      id: userId,
    });

    if (!account) {
      throw new BadRequestException(
        'Account not found',
      );
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

  async verify2FA(
    data: any,
    userId: number,
    token: string,
    accountType: 'user' | 'admin' = 'user'
  ) {
    const repo = this.getRepo(accountType);

    const account = await repo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'], // Needed so generateToken has permissions!
    });

    if (!account || !account.twoFactorSecret) {
      throw new UnauthorizedException(
        '2FA not initialized',
      );
    }

    const result = await verify({
      secret: account.twoFactorSecret,
      token,
    });

    if (!result.valid) {
      throw new UnauthorizedException(
        'Invalid 2FA token',
      );
    }

    await repo.update(userId, {
      isTwoFactorEnabled: true,
    });

    this.deviceService.checkAndAlert(
      account.id, 
      accountType, 
      account.email, 
      data.ip, 
      data.userAgent
    ).catch(err => console.error('Device check failed', err));

    return await generateToken(account);
  }

  // ----------------------------------------------------------------
  // Forgot Password
  // ----------------------------------------------------------------

  async forgotPassword(email: string, accountType: 'user' | 'admin' = 'user') {
    const repo = this.getRepo(accountType);

    const account = await repo.findOneBy({
      email,
    });

    if (!account) {
      return {
        message: 'If email exists, code sent',
      };
    }

    const code = crypto
      .randomBytes(3)
      .toString('hex');

    const expires = new Date(
      Date.now() + 15 * 60 * 1000,
    );


    await repo.update(account.id, {
      passwordResetCode: code,
      passwordResetExpires: expires,
    });

    this.mailService.sendPasswordResetEmail(account.email, code);

    // Return code if in development (to make debugging easier)
    return (this.appService.getNodeEnv() == "development") ? {
      message: 'Reset code generated',
      email,
      code
    } : {
      message: 'Reset code generated',
    };
  }

  // ----------------------------------------------------------------
  // Reset Password
  // ----------------------------------------------------------------

  async resetPassword(data: any, accountType: 'user' | 'admin' = 'user') {
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
      throw new BadRequestException(
        'Invalid or expired code',
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      10,
    );

    await repo.update(account.id, {
      password: hashedPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
    });

    return {
      message: 'Password updated successfully',
    };
  }
}