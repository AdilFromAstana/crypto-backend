import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from 'src/domain/models/token.model';

export class TokenSwaggerModel {
  @ApiProperty({ example: 'ETH' })
  symbol: string;

  @ApiProperty({ example: 'Ethereum' })
  name: string;

  @ApiProperty({ enum: ['crypto', 'fiat'], example: 'crypto' })
  type: TokenType;

  @ApiProperty({ example: 18 })
  decimals: number;
}
