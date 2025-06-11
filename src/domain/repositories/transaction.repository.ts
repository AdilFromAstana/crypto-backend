import { TransactionEntity } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract save(tx: TransactionEntity): Promise<void>;
  abstract findByWalletIdWithFilters(params: {
    walletId?: string;
    page: number;
    limit: number;
    status?: 'pending' | 'success' | 'failed';
    order?: 'ASC' | 'DESC';
  }): Promise<{
    items: TransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }>;
  abstract findById(id: string): Promise<TransactionEntity | null>;
  abstract findAllByUser(userId: string): Promise<TransactionEntity[]>;
  abstract findWithFilters(params: {
    userIdOrEmail?: string;
    page: number;
    limit: number;
    status?: 'pending' | 'success' | 'failed';
    order?: 'ASC' | 'DESC';
  }): Promise<{
    items: TransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }>;
  abstract countByUserId(userId: string): Promise<number>;

  // ✅ Новый метод: сумма за сегодня
  abstract getTotalSentPerDay(
    userId: string,
    tokenSymbol: string,
  ): Promise<number>;

  // ✅ Новый метод: сумма за месяц
  abstract getTotalSentPerMonth(
    userId: string,
    tokenSymbol: string,
  ): Promise<number>;

  // ✅ Новый метод: сумма одному получателю за сегодня
  abstract getTotalToRecipientToday(
    senderId: string,
    recipientId: string,
    tokenSymbol: string,
  ): Promise<number>;
}
