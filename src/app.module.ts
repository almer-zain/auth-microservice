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
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './config/strategies/jwt.strategy';
import { PermissionModule } from './modules/permissions/permissions.module';
import { RoleModule } from './modules/roles/roles.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { AdminsModule } from './modules/admins/admins.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [AppService],
      useFactory: async (appService: AppService) => ({
        transport: {
          host: appService.getMailHost(),
          port: appService.getMailPort(),
          secure: appService.getMailSecure(),
          auth: appService.getMailUser()
            ? {
                user: appService.getMailUser(),
                pass: appService.getMailPass(),
              }
            : undefined, // Mailpit doesn't need auth
        },
        defaults: {
          from: `"${appService.getAppName()}" <${appService.getMailFrom()}>`,
        },
        template: {
          dir: join(__dirname, 'templates'), // Looks in src/modules/mail/templates
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
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
    JwtModule.registerAsync({
      imports: [ConfigManagerModule],
      inject: [AppService], 
      useFactory: (appService: AppService) => ({
        secret: appService.getJwt(),
        signOptions: { 
          expiresIn: appService.getJwtExpiry(),
          algorithm: 'HS256', 

          // issuer: 'auth-microservice', // Identifies who created the token
          // audience: 'my-app-web',      // Identifies who the token is for
          noTimestamp: false,
        },
      })
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AdminsModule,
    PermissionModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppController, JwtStrategy], // <--- Add it here
  exports: [PassportModule, JwtStrategy]

})
export class AppModule {}
