import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import compression from 'compression';
import hpp from 'hpp';
import { Application } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService to replace the old AppService
  const configService = app.get(ConfigService);

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isProd = nodeEnv === 'production';

  // Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // All routes default to /v1/
  });

  /**
   * Proxy Security
   * Trust proxy is required for rate limiting and secure cookies behind Nginx/Cloudflare
   */

  if (isProd) {
    // 2. Cast the instance as an Express Application
    const expressApp = app.getHttpAdapter().getInstance() as Application;

    expressApp.set('trust proxy', 1);
  }

  // Performance: Gzip Compression
  app.use(compression());

  // Security: Helmet (CSP, HSTS, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: isProd
          ? {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:'],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              frameAncestors: ["'none'"],
            }
          : {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'", 'https:', "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
            },
      },
    }),
  );

  // Security: CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  // Security: Prevent HTTP Parameter Pollution
  app.use(hpp());

  app.use(cookieParser());

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation (Enabled only in non-production)
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API Description')
      .setVersion('1.0')
      .addBearerAuth() // Adds JWT support to Swagger UI
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Setup Graceful Shutdown
  setupGracefulShutdown({ app });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
