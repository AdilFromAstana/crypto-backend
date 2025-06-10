import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SendEthDto } from './dto/send-eth.dto';

import { SendEthUseCase } from 'src/application/use-cases/transactions/send-eth.use-case';
import { GetTransactionsByUserUseCase } from 'src/application/use-cases/admin/get-transactions-by-user.use-case';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly sendEthUseCase: SendEthUseCase,
    private readonly getTxsUseCase: GetTransactionsByUserUseCase,
  ) {}

  @Post()
  @ApiBody({ type: SendEthDto })
  async send(
    @Req() req,
    @Body() body: { fromWalletId: string; toWalletId: string; amount: string },
  ) {
    const userId = req.user.userId;
    return this.sendEthUseCase.execute({
      fromWalletId: body.fromWalletId,
      toWalletId: body.toWalletId,
      amount: body.amount,
      userId,
    });
  }

  @Get()
  async list(
    @Query('walletId') walletId,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: 'pending' | 'success' | 'failed',
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.getTxsUseCase.execute({
      walletId,
      page: Number(page),
      limit: Number(limit),
      status,
    });
  }

  @Get('sync-status')
  async syncStatus() {
    return { updated: 0 }; // можешь потом сделать отдельный use-case, если нужно
  }
}
