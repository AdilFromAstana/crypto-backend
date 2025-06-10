import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendEthDto {
  @ApiProperty({ example: 'c7246389-cc93-48cf-8faa-aa8144901d21' })
  @IsString()
  @IsNotEmpty()
  fromWalletId: string;

  @ApiProperty({ example: 'e63f59af-a9cd-4588-9d8b-bc272f2c8ce6' })
  @IsString()
  @IsNotEmpty()
  toWalletId: string;

  @ApiProperty({ example: '0.01' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}
