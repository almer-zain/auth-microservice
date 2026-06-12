import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountDevice } from './entities/account-device.entity';
import { MailService } from '../mail/mail.service';
import { UAParser } from 'ua-parser-js';
import * as geoip from 'geoip-lite';
import { getErrorMessage } from 'src/utils/error';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);
  constructor(
    @InjectRepository(AccountDevice)
    private deviceRepo: Repository<AccountDevice>,
    private mailService: MailService,
  ) {}

  // Do not 'await' this in the Auth flow so it doesn't slow down the login.
  async checkAndAlert(
    accountId: number,
    accountType: 'user' | 'admin',
    email: string,
    ip?: string,
    userAgent?: string,
  ) {
    try {
      // 1. Fallbacks for missing data
      const safeIp = ip || '127.0.0.1';
      const safeUA = userAgent || 'Unknown Device';

      // 2. Parse Data
      const parser = new UAParser(safeUA);
      const browser = parser.getBrowser().name || 'Unknown Browser';
      const os = parser.getOS().name || 'Unknown OS';

      // 3. Get Geolocation locally (0ms)
      const geo = geoip.lookup(safeIp);
      const country = geo?.country || 'Unknown Country';
      const city = geo?.city || 'Unknown City';

      // 4. Check if device is already known for THIS specific user
      const existingDevice = await this.deviceRepo.findOne({
        where: { accountId, accountType, browser, os },
      });

      if (existingDevice) {
        // Known device -> Allow silently, just update their last known IP
        await this.deviceRepo.update(existingDevice.id, {
          ipAddress: safeIp,
          country,
          city,
          lastLoginAt: new Date(),
        });
      } else {
        // 5. NEW DEVICE -> Save it to DB and Alert the user
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

        // Fire the Warning Email
        const location =
          city !== 'Unknown City'
            ? `${city}, ${country}`
            : 'an Unknown Location';
        await this.mailService.sendNewDeviceAlert(email, location, browser, os);

        this.logger.log(
          `New device alert triggered for ${email} (${browser} on ${os})`,
        );
      }
    } catch (error) {
      // Catch errors so the background task doesn't crash the microservice
      this.logger.error(
        `Failed to process device check for ${email}`,
        getErrorMessage(error),
      );
    }
  }
}
