import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';

interface ExchangeCurrencyInput {
  userId: string;
  fromWalletId: string;
  toWalletId: string;
  fromAmount: number;
}

@Injectable()
export class ExchangeCurrencyUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly txRepo: TransactionRepository,
  ) {}

  async execute(input: ExchangeCurrencyInput): Promise<void> {
    const { userId, fromWalletId, toWalletId, fromAmount } = input;

    const from = await this.walletRepo.findById(fromWalletId);
    const to = await this.walletRepo.findById(toWalletId);

    if (!from || !to)
      throw new NotFoundException('Один из кошельков не найден');

    if (from.userId !== userId || to.userId !== userId)
      throw new BadRequestException('Оба кошелька должны принадлежать вам');

    if (!from.canDebit(fromAmount))
      throw new BadRequestException(
        'Недостаточно средств на исходном кошельке',
      );

    let rate: number;
    let toAmount: number;

    const isSameToken = from.tokenSymbol === to.tokenSymbol;

    if (isSameToken) {
      rate = 1;
      toAmount = fromAmount;
    } else {
      rate = await this.getExchangeRate(from.tokenSymbol, to.tokenSymbol);
      toAmount = this.calculateToAmount(from.type, to.type, fromAmount, rate);
    }

    from.debit(fromAmount);
    to.credit(toAmount);

    await this.walletRepo.save(from);
    await this.walletRepo.save(to);

    const tx = TransactionEntity.create({
      type: 'exchange',
      fromWalletId: from.id,
      toWalletId: to.id,
      amount: fromAmount,
      fromAddress: from.address,
      toAddress: to.address,
      fromToken: from.tokenSymbol,
      toToken: to.tokenSymbol,
      exchangeRate: rate,
    });

    await this.txRepo.save(tx);
  }

  private async getExchangeRate(
    fromSymbol: string,
    toSymbol: string,
  ): Promise<number> {
    const rates: Record<string, Record<string, number>> = {
      ETH: { BTC: 0.05, USD: 3500, EUR: 3200 },
      BTC: { ETH: 20, USD: 70000, EUR: 66000 },
      USD: { ETH: 1 / 3500, BTC: 1 / 70000, EUR: 0.92 },
      EUR: { USD: 1.08, ETH: 1 / 3200, BTC: 1 / 66000 },
      USDT: { USD: 1, EUR: 0.93, ETH: 1 / 3500, BTC: 1 / 70000 },
    };

    const rate = rates[fromSymbol]?.[toSymbol];
    if (!rate) {
      throw new BadRequestException(
        `Курс обмена ${fromSymbol} → ${toSymbol} не найден`,
      );
    }

    return rate;
  }

  private calculateToAmount(
    fromType: 'fiat' | 'crypto',
    toType: 'fiat' | 'crypto',
    fromAmount: number,
    rate: number,
  ): number {
    return fromType === 'fiat' && toType === 'crypto'
      ? fromAmount / rate
      : fromAmount * rate;
  }
}
