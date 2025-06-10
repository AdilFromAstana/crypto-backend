import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

@Injectable()
export class GetUserTransactionsAdminUseCase {
  constructor(private readonly txRepo: TransactionRepository) {}

  async execute(params: {
    userId: string;
    page: number;
    limit: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    startDate?: string;
    endDate?: string;
    type?: 'incoming' | 'outgoing';
  }) {
    return this.txRepo.findWithFilters(params);
  }
}
