import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { buildSwaggerConfig } from './config/swagger.config';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = buildSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
