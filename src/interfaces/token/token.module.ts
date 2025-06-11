import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from 'src/application/service/token.service';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { StaticTokenRepository } from 'src/infrastructure/repositories/static-token.repository';

@Module({
  controllers: [TokenController],
  providers: [
    TokenService,
    {
      provide: TokenRepository,
      useClass: StaticTokenRepository,
    },
  ],
})
export class TokenModule {}
