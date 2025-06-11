import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SendTokenToUserDto {
  @ApiProperty({ example: 'wallet-id-1' })
  @IsString()
  fromWalletId: string;

  @ApiProperty({ example: 'wallet-id-2' })
  @IsString()
  toWalletId: string;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'На подарок', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
