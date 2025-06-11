export type TokenType = 'crypto' | 'fiat';

export interface TokenModel {
  symbol: string; // 'ETH', 'USD', 'BTC'
  name: string; // 'Ethereum', 'US Dollar'
  type: TokenType; // 'crypto' | 'fiat'
  decimals: number; // 18, 2, 6 и т.д.
}
