import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);
  private isEnabled: boolean;
  private secret: string;

  constructor(
    private configService: ConfigService,
    private appService: AppService
  ) {
    // Check if CAPTCHA is enabled in .env
    this.isEnabled = this.appService.getCaptchaEnabled();
    this.secret = this.appService.getCaptchaSecret();
  }

  async verify(token?: string, ip?: string): Promise<void> {
    // 1. If feature is turned off, just skip!
    if (!this.isEnabled) return;

    // 2. If enabled but no token was sent by frontend
    if (!token) {
      throw new BadRequestException('CAPTCHA token is required');
    }

    try {
      // 3. Verify with Cloudflare Turnstile (or swap URL for Google reCAPTCHA)
      const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const formData = new URLSearchParams();
      formData.append('secret', this.secret);
      formData.append('response', token);
      if (ip) formData.append('remoteip', ip); // Optional but good for security

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();

      if (!data.success) {
        this.logger.warn(`CAPTCHA failed: ${JSON.stringify(data['error-codes'])}`);
        throw new BadRequestException('Failed CAPTCHA verification');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('CAPTCHA verification service error', error);
      throw new BadRequestException('CAPTCHA verification unavailable');
    }
  }
}