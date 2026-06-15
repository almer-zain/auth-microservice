import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const result = await this.health.check([
      // Database connection health
      () => this.db.pingCheck('database', { timeout: 3000 }),

      // External API dependency health
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),

      // Memory usage: Heap should not exceed 150MB (adjust based on your environment)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),

      // Memory usage: RSS should not exceed 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),

      // Disk storage: Ensure at least 50% of the storage is free
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.5,
        }),
    ]);

    // Log the health status for monitoring tools
    if (result.status === 'ok') {
      this.logger.log('Health check passed', { details: result.info });
    } else {
      this.logger.error('Health check failed', { details: result.error });
    }

    return result;
  }
}
