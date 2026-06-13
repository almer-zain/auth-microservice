import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { redisStore } from 'cache-manager-redis-yet';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import * as Joi from 'joi';

// Namespaces & Strategies
import jwtConfig from './config/namespaces/jwt.config';
import { JwtAccessStrategy } from './config/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './config/strategies/jwt-refresh.strategy';

// Feature Modules
import { HealthModule } from './modules/health/health.module';
import { AdminsModule } from './modules/admins/admins.module';
import { PermissionModule } from './modules/permissions/permissions.module';
import { RoleModule } from './modules/roles/roles.module';
import { DatabaseType, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    // 1. CONFIGURATION (Strict Validation)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().default(false),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRY: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRY: Joi.string().required(),
        RATELIMIT_TTL: Joi.number().default(60000),
        RATELIMIT_MAX: Joi.number().default(10),
        USE_REDIS: Joi.boolean().default(false),
        REDIS_URL: Joi.string().when('USE_REDIS', {
          is: true,
          then: Joi.required(),
        }),
      }),
    }),

    // 2. GRACEFUL SHUTDOWN (Crucial for Production)
    // TODO: Add this...
    GracefulShutdownModule.forRoot({
      cleanup: () => {
        // This is where you close DB connections manually if needed
        console.log(`Finalizing cleanup before shutdown...`);
      },
    }),

    // 3. DATABASE
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        return {
          ...({
            type: config.get<string>('DB_TYPE') as DatabaseType,
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_NAME'),
            synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
            extra: {
              connectionLimit: 10,
              queueLimit: 0,
              idleTimeout: 60000,
            },
          } as DataSourceOptions),
          autoLoadEntities: true,
          logging: config.get<string>('NODE_ENV') === 'development',
          maxQueryExecutionTime: 1000,
        };
      },
    }),

    // 4. CACHING (Redis or Memory)
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        if (config.get<boolean>('USE_REDIS')) {
          return {
            store: await redisStore({
              url: config.get('REDIS_URL'),
              ttl: config.get<number>('CACHE_TTL') || 600,
            }),
          };
        }
        return { ttl: config.get<number>('CACHE_TTL') || 600 };
      },
    }),

    // 5. MAILER
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: config.get('MAIL_USER')
            ? {
                user: config.get('MAIL_USER'),
                pass: config.get('MAIL_PASS'),
              }
            : undefined,
        },
        defaults: { from: config.get('MAIL_FROM') },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),

    // 6. SECURITY: Rate Limiting
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            // Adding default values or casting to number fixes the TS error
            ttl: config.get<number>('RATELIMIT_TTL', 60000),
            limit: config.get<number>('RATELIMIT_MAX', 10),
          },
        ],
      }),
    }),

    // 7. AUTH
    JwtModule.register({}), // Handled dynamically in AuthService
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 8. APP MODULES
    HealthModule,
    AdminsModule,
    PermissionModule,
    RoleModule,
  ],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
