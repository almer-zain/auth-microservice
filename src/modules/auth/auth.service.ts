import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';

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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  // ----------------------------------------------------------------
  // Register
  // ----------------------------------------------------------------

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // ----------------------------------------------------------------
  // Login
  // ----------------------------------------------------------------

  async login(data: any) {
    const user = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (
      !user ||
      !(await bcrypt.compare(
        data.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (user.isTwoFactorEnabled) {
      return {
        mfaRequired: true,
        userId: user.id,
      };
    }

    return generateToken(user);
  }

  // ----------------------------------------------------------------
  // Generate 2FA Secret
  // ----------------------------------------------------------------

  async generate2FASecret(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new BadRequestException(
        'User not found',
      );
    }

    const secret = generateSecret();

    const uri = generateURI({
      issuer: 'MyMicroservice',
      label: user.email,
      secret,
    });

    const qrCode = await QRCode.toDataURL(uri);

    await this.userRepository.update(userId, {
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
    userId: number,
    token: string,
  ) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException(
        '2FA not initialized',
      );
    }

    const result = await verify({
      secret: user.twoFactorSecret,
      token,
    });

    if (!result.valid) {
      throw new UnauthorizedException(
        'Invalid 2FA token',
      );
    }

    await this.userRepository.update(userId, {
      isTwoFactorEnabled: true,
    });

    return generateToken(user);
  }

  // ----------------------------------------------------------------
  // Forgot Password
  // ----------------------------------------------------------------

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
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

    await this.userRepository.update(user.id, {
      passwordResetCode: code,
      passwordResetExpires: expires,
    });

    return {
      message: 'Reset code generated',
      code,
    };
  }

  // ----------------------------------------------------------------
  // Reset Password
  // ----------------------------------------------------------------

  async resetPassword(data: any) {
    const user = await this.userRepository.findOneBy({
      email: data.email,
      passwordResetCode: data.code,
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException(
        'Invalid or expired code',
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      10,
    );

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
    });

    return {
      message: 'Password updated successfully',
    };
  }
}