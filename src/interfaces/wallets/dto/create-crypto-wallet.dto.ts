import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCryptoWalletDto {
  @ApiProperty({ example: 'ETH' })
  @IsString()
  tokenSymbol: string;

  @ApiProperty({ example: 'ethereum' })
  @IsString()
  network: string;

  @ApiProperty({ example: 'Основной кошелёк', required: false })
  @IsOptional()
  @IsString()
  label?: string;
}