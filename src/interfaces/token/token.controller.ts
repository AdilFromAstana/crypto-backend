import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TokenService } from 'src/application/service/token.service';
import { TokenSwaggerModel } from './swagger/token.swagger';
import { TokenModel } from 'src/domain/models/token.model';

@ApiTags('Tokens')
@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  @ApiOperation({ summary: 'Список валют' })
  @ApiResponse({ status: 200, type: [TokenSwaggerModel] })
  getAll(): Promise<TokenModel[]> {
    return this.tokenService.getAll();
  }

  @Get(':symbol')
  @ApiOperation({ summary: 'Получить валюту по символу' })
  @ApiParam({ name: 'symbol', example: 'ETH' })
  @ApiResponse({ status: 200, type: TokenSwaggerModel })
  getBySymbol(@Param('symbol') symbol: string): Promise<TokenModel | null> {
    return this.tokenService.getBySymbol(symbol);
  }
}
