import { DocumentBuilder } from '@nestjs/swagger';

export const buildSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle('Crypto Wallet API')
    .setDescription('Документация для сервиса обмена и отправки криптовалют')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
