import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}


  private getEnv<T = string>(key: string, fallback?: T): T {
    const value = this.configService.get<T>(key);

    if (value === undefined || value === null) {
      if (fallback !== undefined) return fallback;
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
  }

  /**
   * App Configurations
   */
  getJWT(): string {
    return this.getEnv('JWT_SECRET');
  }

  getNodeEnv(): string {
    return this.getEnv('NODE_ENV', 'development');
  }

  /**
   * Database Configurations
   */
  getDatabaseType(): string {
    return this.getEnv('DB_TYPE', 'mysql');
  }

  getDatabaseUrl(): string {
    return this.getEnv('DB_HOST', 'localhost');
  }

  getDatabasePort(): number {
    return this.getEnv<number>('DB_PORT', 3306);
  }

  getDatabaseUsername(): string {
    return this.getEnv('DB_USERNAME', 'root');
  }

  getDatabasePassword(): string {
    return this.getEnv('DB_PASSWORD', 'root');
  }

  getDatabaseName(): string {
    return this.getEnv('DB_NAME', 'test');
  }

  getDatabaseSynchronize(): boolean {
    return this.getEnv<boolean>('DB_SYNCHRONIZE', true);
  }

  /**
   * Rate Limiting Configurations
   */
  getRateLimitTTL(): number {
    return this.getEnv<number>('RATELIMIT_TTL', 600000);
  }

  getRateLimitMax(): number {
    return this.getEnv<number>('RATELIMIT_MAX', 10);
  }
}


