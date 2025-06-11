import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetTransactionsByUserUseCase } from 'src/application/use-cases/admin/get-transactions-by-user.use-case';
import { SendTokenToUserUseCase } from 'src/application/use-cases/transactions/send-token-to-user.use-case';
import { ExchangeCurrencyUseCase } from 'src/application/use-cases/transactions/exchange-between-own-wallets.use-case';
import { ExchangeCurrencyDto } from './dto/exchange-currency.dto';
import { SendTokenToUserDto } from './dto/send-token-to-user.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly exchangeCurrency: ExchangeCurrencyUseCase,
    private readonly getTxsUseCase: GetTransactionsByUserUseCase,
    private readonly sendToUser: SendTokenToUserUseCase,
  ) {}

  @Post('exchange-between-own-wallets')
  @ApiOperation({ summary: 'Обмен или перевод между своими кошельками' })
  @ApiBody({ type: ExchangeCurrencyDto })
  @ApiResponse({ status: 201, description: 'Операция выполнена успешно' })
  async exchange(@Req() req, @Body() dto: ExchangeCurrencyDto) {
    await this.exchangeCurrency.execute({
      userId: req.user.userId,
      fromWalletId: dto.fromWalletId,
      toWalletId: dto.toWalletId,
      fromAmount: dto.fromAmount,
    });

    return { success: true };
  }

  @Post('send-to-user')
  @ApiOperation({ summary: 'Перевод токенов другому пользователю' })
  @ApiBody({ type: SendTokenToUserDto })
  @ApiResponse({ status: 201, description: 'Перевод выполнен успешно' })
  async sendToOther(@Req() req, @Body() dto: SendTokenToUserDto) {
    await this.sendToUser.execute({
      userId: req.user.userId,
      fromWalletId: dto.fromWalletId,
      toWalletId: dto.toWalletId,
      amount: dto.amount,
      note: dto.note,
    });

    return { success: true };
  } 

  @Get()
  @ApiOperation({ summary: 'Получить список транзакций пользователя' })
  @ApiResponse({ status: 200, description: 'Список транзакций' })
  async list(@Req() req, @Query() query: GetTransactionsQueryDto) {
    return this.getTxsUseCase.execute({
      walletId: query.walletId,
      page: Number(query.page),
      limit: Number(query.limit),
      status: query.status,
      order: query.order ?? 'DESC',
    });
  }
}
