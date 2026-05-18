import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppService } from 'src/app.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private mailerService: MailerService,
    private appService: AppService
  ) {}

  async sendPasswordResetEmail(email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        template: './reset-password', // Points to reset-password.hbs
        context: {
          // These variables are injected into the HTML template
          code: code,
          supportEmail: "" // TODO: Add support email  ,
        },
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error.stack);
    }
  }

  async sendNewDeviceAlert(email: string, location: string, browser: string, os: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Security Alert: New sign-in detected',
        template: './new-device', // Create a simple HTML template for this
        context: { location, browser, os, time: new Date().toUTCString() },
      });
      this.logger.log(`New device alert sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send new device alert to ${email}`);
    }
  }
}