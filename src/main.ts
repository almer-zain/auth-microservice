import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // Get the ConfigService instance from the app
  const configService = app.get(ConfigService);


  // Cookies
  app.use(cookieParser());

  // Helmet
  const nodeEnv = configService.get<string>('NODE_ENV');
  const isDev = nodeEnv === 'development';
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: isDev
          ? {
              // Dev (Swagger Compatibility)
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'", "https:", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:", "validator.swagger.io"],
            }
          : {
              // Productions
              defaultSrc: ["'self'"],
              styleSrc: ["'self'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", "data:"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              frameAncestors: ["'none'"],
            },
      },
    })
  );

  // Pipes
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

  // CORS
  app.enableCors();

  // CSRF
  // TODO: ADD CSRF
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
