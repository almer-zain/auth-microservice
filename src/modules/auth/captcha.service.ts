import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 1. Define the exact shape of the Cloudflare API response
interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);
  private isEnabled: boolean;
  private secret: string;

  constructor(private readonly configService: ConfigService) {
    this.isEnabled = this.configService.get<boolean>('CAPTCHA_ENABLED', true);
    this.secret = this.configService.get<string>('CAPTCHA_SECRET', '');
  }

  async verify(token?: string, ip?: string): Promise<void> {
    if (!this.isEnabled) return;

    if (!token) {
      throw new BadRequestException('CAPTCHA token is required');
    }

    try {
      const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const formData = new URLSearchParams();
      formData.append('secret', this.secret);
      formData.append('response', token);
      if (ip) formData.append('remoteip', ip);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // 2. Safely cast the response to our defined Interface
      const data = (await response.json()) as TurnstileResponse;

      if (!data.success) {
        // 3. Typescript now knows 'error-codes' is an array of strings
        this.logger.warn(
          `CAPTCHA failed: ${JSON.stringify(data['error-codes'])}`,
        );
        throw new BadRequestException('Failed CAPTCHA verification');
      }
    } catch (error: unknown) {
      // 4. Type error as unknown
      if (error instanceof BadRequestException) throw error;

      // Handle the unknown error safely
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('CAPTCHA verification service error', errorMessage);
      throw new BadRequestException('CAPTCHA verification unavailable');
    }
  }
}
