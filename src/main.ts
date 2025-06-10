import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // или укажи конкретный origin: 'http://localhost:5173'
    credentials: true, // если используешь cookies
  });

  app.useGlobalPipes(new ValidationPipe()); // ← обязательно для class-validator

  const config = new DocumentBuilder()
    .setTitle('Crypto Wallet API')
    .setDescription('Документация для сервиса обмена и отправки криптовалют')
    .setVersion('1.0')
    .addBearerAuth() // поддержка JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
