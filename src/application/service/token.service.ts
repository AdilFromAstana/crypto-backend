import { Injectable } from '@nestjs/common';
import { TokenRepository } from 'src/domain/repositories/token.repository';
import { TokenModel } from 'src/domain/models/token.model';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepo: TokenRepository) {}

  getAll(): Promise<TokenModel[]> {
    return this.tokenRepo.findAll();
  }

  getBySymbol(symbol: string): Promise<TokenModel | null> {
    return this.tokenRepo.findBySymbol(symbol);
  }
}
