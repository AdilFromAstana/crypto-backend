import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExchangeCurrencyDto {
  @ApiProperty({ example: 'wallet-id-1' })
  @IsString()
  fromWalletId: string;

  @ApiProperty({ example: 'wallet-id-2' })
  @IsString()
  toWalletId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  fromAmount: number;
}
