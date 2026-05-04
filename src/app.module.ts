import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { HealthModule } from './modules/health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { ConfigManagerModule } from './config/config-manager.module';

@Module({
  imports: [
    HealthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigManagerModule],
      inject: [AppService], 
      useFactory: async (appService: AppService) => {
        if (appService.useRedis()) {
          return {
            store: await redisStore({
              url: appService.getRedisUrl(),
              ttl: appService.getCacheTTL(),
            }),
          };
        }
        // Fallback to In-Memory if Redis is off
        return {
          ttl: appService.getCacheTTL(),
        };
      },
    }),

    GracefulShutdownModule.forRoot({
      cleanup: async (app) => {
        console.log('App is shutting down...');
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [AppService],
      useFactory: (appService: AppService) => ({
        throttlers: [
          {
            ttl: appService.getRateLimitTTL(),
            limit: appService.getRateLimitMax(),
          },
        ],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),

        DB_TYPE: Joi.string().valid('mysql', 'postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().default(false),

        JWT_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        convert: true, 
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigManagerModule],
      inject: [AppService],
      useFactory: (appService: AppService) => ({
        type: appService.getDatabaseType() as any,
        host: appService.getDatabaseUrl(),
        port: appService.getDatabasePort(),
        username: appService.getDatabaseUsername(),
        password: appService.getDatabasePassword(),
        database: appService.getDatabaseName(),
        synchronize: appService.getDatabaseSynchronize(),
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
