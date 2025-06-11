import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly txRepo: TransactionRepository) {}

  async execute(params: {
    userId: string;
    walletId?: string;
    page?: number;
    limit?: number;
    status?: 'pending' | 'success' | 'failed';
    order?: 'ASC' | 'DESC';
  }): Promise<{
    items: TransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      userId,
      walletId,
      page = 1,
      limit = 20,
      status,
      order = 'DESC',
    } = params;

    if (walletId) {
      return this.txRepo.findByWalletIdWithFilters({
        walletId,
        page,
        limit,
        status,
        order,
      });
    }

    return this.txRepo.findWithFilters({
      userIdOrEmail: userId,
      page,
      limit,
      status,
      order,
    });
  }
}
