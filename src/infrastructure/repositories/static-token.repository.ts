import { Injectable } from '@nestjs/common';
import { TokenModel } from 'src/domain/models/token.model';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { SUPPORTED_TOKENS } from '../config/supported-tokens.config';

@Injectable()
export class StaticTokenRepository implements TokenRepository {
  async findAll(): Promise<TokenModel[]> {
    return SUPPORTED_TOKENS;
  }

  async findBySymbol(symbol: string): Promise<TokenModel | null> {
    return SUPPORTED_TOKENS.find((t) => t.symbol === symbol) || null;
  }
}
