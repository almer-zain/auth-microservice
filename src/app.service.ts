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
  getNodeEnv(): string {
    return this.getEnv<string>('NODE_ENV', 'development');
  }

  /**
   * Jwt
   */
  getJwt(): string {
    return this.getEnv<string>('JWT_SECRET');
  }

  getJwtExpiry(): number {
    return this.getEnv<number>('JWT_EXPIRY');
  }

  /**
   * Database Configurations
   */
  getDatabaseType(): string {
    return this.getEnv<string>('DB_TYPE', 'mysql');
  }

  getDatabaseUrl(): string {
    return this.getEnv<string>('DB_HOST', 'localhost');
  }

  getDatabasePort(): number {
    return this.getEnv<number>('DB_PORT', 3306);
  }

  getDatabaseUsername(): string {
    return this.getEnv<string>('DB_USERNAME', 'root');
  }

  getDatabasePassword(): string {
    return this.getEnv<string>('DB_PASSWORD', 'root');
  }

  getDatabaseName(): string {
    return this.getEnv<string>('DB_NAME', 'test');
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

  /**
   * Cookies Configurations
   */
  getCookieSecret(): string {
    return this.getEnv<string>('COOKIE_SECRET', '0df5');
  }

  getCookieResave(): boolean {
    return this.getEnv<boolean>('COOKIE_RESAVE', false);
  }

  getCookieSaveUninitialized(): boolean {
    return this.getEnv<boolean>('COOKIE_SAVE_UNINITIALIZED', false);
  }

  getCookieMaxAge(): number {
    return this.getEnv<number>('COOKIE_MAX_AGE', 86400000);
  }

  /**
   * CSRF Configurations
   */
  getCsrfSecret(): string {
    return this.getEnv<string>('CSRF_SECRET', "");
  }

  /**
   * Frontend Configurations
   */
  getFrontendUrl() : string {
    return this.getEnv<string>('FRONTEND_URL', "http://localhost:3000")
  }

  /**
   * Redis Configurations
   */
  useRedis(): boolean {
    return this.configService.get<boolean>('USE_REDIS', false);
  }

  getRedisUrl(): string {
    return this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
  }
  
  /**
   * Caching Configurations
   */
  getCacheTTL(): number {
    return this.configService.get<number>('CACHE_TTL', 600);
  }

}