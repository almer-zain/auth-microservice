import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDevice } from './entities/account-device.entity';
import { MailService } from '../mail/mail.service';
import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';
import { getErrorMessage } from 'src/utils/error.util';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(AccountDevice)
    private readonly deviceRepo: Repository<AccountDevice>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Analyzes login metadata to detect new devices and issue security alerts.
   * This process is designed to run asynchronously to avoid blocking the main auth flow.
   *
   * @param accountId - The ID of the authenticated entity
   * @param accountType - Discriminator for 'user' or 'admin'
   * @param email - Target email for security notifications
   * @param ip - Remote IP address
   * @param userAgent - Raw browser User-Agent string
   */
  async checkAndAlert(
    accountId: number,
    accountType: 'user' | 'admin',
    email: string,
    ip?: string,
    userAgent?: string,
  ) {
    try {
      const safeIp = ip || '127.0.0.1';
      const safeUA = userAgent || 'Unknown Device';

      const parser = new UAParser(safeUA);
      const browser = parser.getBrowser().name || 'Unknown Browser';
      const os = parser.getOS().name || 'Unknown OS';

      const geo = geoip.lookup(safeIp);
      const country = geo?.country || 'Unknown Country';
      const city = geo?.city || 'Unknown City';

      const existingDevice = await this.deviceRepo.findOne({
        where: { accountId, accountType, browser, os },
      });

      if (existingDevice) {
        await this.deviceRepo.update(existingDevice.id, {
          ipAddress: safeIp,
          country,
          city,
          lastLoginAt: new Date(),
        });
      } else {
        const newDevice = this.deviceRepo.create({
          accountId,
          accountType,
          ipAddress: safeIp,
          browser,
          os,
          country,
          city,
        });
        await this.deviceRepo.save(newDevice);

        const location =
          city !== 'Unknown City'
            ? `${city}, ${country}`
            : 'an Unknown Location';
        await this.mailService.sendNewDeviceAlert(email, location, browser, os);

        this.logger.log(
          `Security: New device registered for ${email} (${browser}/${os})`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Security background task failed for ${email}: ${getErrorMessage(error)}`,
      );
    }
  }
}
