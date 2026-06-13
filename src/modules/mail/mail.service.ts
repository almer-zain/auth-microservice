import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getErrorMessage, getErrorStack } from 'src/utils/error.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sends a modern password reset email with both a code and a direct link.
   */
  async sendPasswordResetEmail(email: string, code: string, resetUrl: string) {
    try {
      const supportEmail = this.configService.get<string>(
        'SUPPORT_EMAIL',
        'support@example.com',
      );

      const mailFrom = this.configService.get<string>(
        'MAIL_FROM',
        '"No Reply" <noreply@example.com>',
      );

      const companyName = this.configService.get<string>(
        'COMPANY_NAME',
        '2026',
      );

      const copyrightNoticeYear = this.configService.get<string>(
        'COPYRIGHT_NOTICE_YEAR',
        'Inertia Technology',
      );

      await this.mailerService.sendMail({
        to: email,
        from: mailFrom, // Overrides default if needed
        subject: 'Reset your password',
        template: './reset-password', // Path to your .hbs file
        context: {
          code: code,
          resetUrl: resetUrl,
          supportEmail: supportEmail,

          // Company Info
          copyrightNoticeYear: copyrightNoticeYear,
          companyName: companyName,
        },
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to send email to ${email}: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
    }
  }

  async sendNewDeviceAlert(
    email: string,
    location: string,
    browser: string,
    os: string,
  ) {
    try {
      const companyName = this.configService.get<string>(
        'COMPANY_NAME',
        '2026',
      );

      const copyrightNoticeYear = this.configService.get<string>(
        'COPYRIGHT_NOTICE_YEAR',
        'Inertia Technology',
      );

      await this.mailerService.sendMail({
        to: email,
        subject: 'Security Alert: New sign-in detected',
        template: './new-device', // Create a simple HTML template for this
        context: {
          location,
          browser,
          os,
          time: new Date().toUTCString(),
          resetUrl: this.configService.get('FRONTEND_URL') + '/forgot-password',

          // Company Info
          companyName: companyName,
          copyrightNoticeYear: copyrightNoticeYear,
        },
      });
      this.logger.log(`New device alert sent to ${email}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to send new device alert to ${email}`,
        getErrorStack(error),
      );
    }
  }
}
