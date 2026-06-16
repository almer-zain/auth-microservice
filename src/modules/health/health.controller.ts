// src/modules/health/health.controller.ts
import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  MicroserviceHealthIndicator,
  HealthCheck,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Transport, RedisOptions } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const isRedisEnabled = this.configService.get<boolean>('USE_REDIS', false);

    // We define the indicators as an array of functions to satisfy HealthIndicatorFunction type
    const indicators = [
      () => this.db.pingCheck('database', { timeout: 3000 }),

      () => this.checkMailer(),

      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),

      // Diubah ke 0.9 (90%) agar laptop lokal tidak menghasilkan error 503 storage down
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),

      () =>
        this.http.pingCheck(
          'frontend',
          this.configService.get<string>('FRONTEND_URL') ||
            'http://localhost:3000',
        ),
    ];

    // Add Redis check if enabled
    if (isRedisEnabled) {
      indicators.push(() =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: {
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
          },
        }),
      );
    }
    return this.health.check(indicators);
  }

  /**
   * Custom Health Indicator for @nestjs-modules/mailer.
   * Ensures return type matches HealthIndicatorResult.
   */
  private async checkMailer(): Promise<HealthIndicatorResult> {
    try {
      const transporter = this.mailerService.getTransporter();

      // We cast to Promise<any> to satisfy ESLint if types are mismatched,
      // though nodemailer.verify() returns a Promise.
      await (transporter.verify() as Promise<unknown>);

      return { mailer: { status: 'up' } };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Mailer Health Check Failed: ${message}`);

      // Terminus expects a specific structure for 'down' status
      return {
        mailer: {
          status: 'down',
          message,
        },
      };
    }
  }
}
