import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';

@Injectable()
export class GetTransactionsByUserUseCase {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(params: {
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
  }> {
    return this.transactionRepo.findByWalletIdWithFilters({
      walletId: params.walletId,
      page: params.page,
      limit: params.limit,
      status: params.status,
      order: params.order ?? 'DESC',
    });
  }
}
