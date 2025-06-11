import { TokenModel } from 'src/domain/models/token.model';

export const SUPPORTED_TOKENS: TokenModel[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    decimals: 18,
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    type: 'crypto',
    decimals: 6,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    decimals: 8,
  },
  {
    symbol: 'USD',
    name: 'US Dollar',
    type: 'fiat',
    decimals: 2,
  },
  {
    symbol: 'KZT',
    name: 'Kazakhstani Tenge',
    type: 'fiat',
    decimals: 2,
  },
  {
    symbol: 'EUR',
    name: 'Euro',
    type: 'fiat',
    decimals: 2,
  },
];
