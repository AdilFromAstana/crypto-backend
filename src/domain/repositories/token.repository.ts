import { TokenModel } from '../models/token.model';

export abstract class TokenRepository {
  abstract findAll(): Promise<TokenModel[]>;
  abstract findBySymbol(symbol: string): Promise<TokenModel | null>;
}
