import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFiatWalletDto {
  @ApiProperty({ example: 'USD' })
  @IsString()
  tokenSymbol: string;

  @ApiProperty({ example: 'Личный', required: false })
  @IsOptional()
  @IsString()
  label?: string;
}
