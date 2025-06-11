import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetTransactionsQueryDto {
  @ApiProperty({ description: 'ID кошелька', type: String })
  @IsString()
  walletId: string;

  @ApiPropertyOptional({
    description: 'Статус',
    enum: ['pending', 'success', 'failed'],
  })
  @IsOptional()
  @IsEnum(['pending', 'success', 'failed'])
  status?: 'pending' | 'success' | 'failed';

  @ApiProperty({
    description: 'Сортировка по дате',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';

  @ApiProperty({ description: 'Номер страницы', default: '1' })
  @IsNumberString()
  page: string = '1';

  @ApiProperty({ description: 'Лимит на странице', default: '20' })
  @IsNumberString()
  limit: string = '20';
}
