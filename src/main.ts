import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { doubleCsrf } from 'csrf-csrf';
import { AppService } from './app.service';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Get the ConfigService instance from the app
  const appService = app.get(AppService); 

  const nodeEnv = appService.getNodeEnv();
  const isProd = nodeEnv === 'production';
  
   /**
   * When the app is behind a proxy (Nginx, Cloudflare, AWS ELB, etc), 
   * we must trust the proxy to correctly handle 'secure' cookies 
   * and get the real client IP for rate limiting.
   */
  if (isProd) {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }

  // JSON Compression
  app.use(compression());

  // Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: isProd
          ? 
            {
              // Productions
              defaultSrc: ["'self'"],
              styleSrc: ["'self'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", "data:"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              frameAncestors: ["'none'"],
            }
          : 
            {
              // Dev (Swagger Compatibility)
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'", "https:", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "validator.swagger.io"],
            },
      },
    })
  );
  
  // CORS
  app.enableCors({
    origin: appService.getFrontendUrl(),
    credentials: true,  
  });

  // Cookies
  app.use(cookieParser());
  const cookieSecret = appService.getCookieSecret();
  const cookieMaxAge = appService.getCookieMaxAge()
  

  // Initialize HTTP sessions
  const cookieSaveUninitialized = appService.getCookieSaveUninitialized()
  const cookieResave = appService.getCookieResave()
  app.use(
    session({
      secret: cookieSecret,
      resave: cookieResave,
      saveUninitialized: cookieSaveUninitialized,
      cookie: { 
        sameSite: 'lax',
        httpOnly: true, 
        secure: isProd,
        maxAge: cookieMaxAge // 24h expiry
      }, 
    }),
  );


  // Configure CSRF (using csrf-csrf recommended by NestJS docs)
  const csrfSecret = appService.getCsrfSecret()!;
  const { 
      invalidCsrfTokenError,
      generateCsrfToken,
      validateRequest,
      doubleCsrfProtection
   } = doubleCsrf({
    getSecret: (req) => csrfSecret,
    getSessionIdentifier: (req) => req.session.id, // return the requests unique identifier
    cookieName: isProd ? "__Host-psifi.x-csrf-token" : "psifi-csrf-token",
    cookieOptions: {
      sameSite: "lax",
      path: "/",
      secure: isProd,
      httpOnly: true,
      maxAge: cookieMaxAge,
    },
    size: 32, 
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
  });
  app.use(doubleCsrfProtection);

  // HPP (HTTP Parameter Pollution)
  const hpp = require('hpp');
  app.use(hpp({ whitelist: ['filter', 'tags'] }));

  // Global Pipes (Validation)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strip away fields that aren't in the DTO
    forbidNonWhitelisted: true,    // Throw error if extra fields are sent
    transform: true,               // Automatically convert strings to numbers/booleans
  }));

  // Docs
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Graceful shutdown
  setupGracefulShutdown({ app });
    
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
