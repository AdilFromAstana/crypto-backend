import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TRANSFER_LIMITS } from '../config/transfer-limits';

@Injectable()
export class TransferLimitService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async validateTransfer({
    userId,
    recipientId,
    tokenSymbol,
    amount,
  }: {
    userId: string;
    recipientId: string;
    tokenSymbol: string;
    amount: number;
  }) {
    const {
      MAX_PER_TRANSACTION,
      MAX_PER_DAY,
      MAX_PER_MONTH,
      MAX_PER_RECIPIENT_PER_DAY,
    } = TRANSFER_LIMITS;

    if (amount > MAX_PER_TRANSACTION) {
      throw new BadRequestException('Превышен лимит на одну операцию');
    }

    const dailyTotal = await this.transactionRepo.getTotalSentPerDay(
      userId,
      tokenSymbol,
    );
    if (dailyTotal + amount > MAX_PER_DAY) {
      throw new BadRequestException('Превышен дневной лимит');
    }

    const monthlyTotal = await this.transactionRepo.getTotalSentPerMonth(
      userId,
      tokenSymbol,
    );
    if (monthlyTotal + amount > MAX_PER_MONTH) {
      throw new BadRequestException('Превышен месячный лимит');
    }

    const recipientTotal = await this.transactionRepo.getTotalToRecipientToday(
      userId,
      recipientId,
      tokenSymbol,
    );
    if (recipientTotal + amount > MAX_PER_RECIPIENT_PER_DAY) {
      throw new BadRequestException('Превышен лимит на получателя');
    }
  }
}
