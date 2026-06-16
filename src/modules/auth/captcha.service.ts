import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);
  private readonly isEnabled: boolean;
  private readonly secret: string;

  constructor(private readonly configService: ConfigService) {
    this.isEnabled = this.configService.get<boolean>('CAPTCHA_ENABLED', true);
    this.secret = this.configService.get<string>('CAPTCHA_SECRET', '');
  }

  /**
   * Validates a Cloudflare Turnstile token.
   *
   * @param token - The client-side CAPTCHA response token
   * @param ip - Optional remote IP for verification affinity
   * @throws BadRequestException if verification fails or token is missing
   */
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data = (await response.json()) as TurnstileResponse;

      if (!data.success) {
        this.logger.warn(
          `CAPTCHA validation rejected: ${JSON.stringify(data['error-codes'])}`,
        );
        throw new BadRequestException('Failed CAPTCHA verification');
      }
    } catch (error: unknown) {
      if (error instanceof BadRequestException) throw error;

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`CAPTCHA service unreachable: ${errorMessage}`);
      throw new BadRequestException('CAPTCHA verification unavailable');
    }
  }
}
