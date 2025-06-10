import { Injectable } from '@nestjs/common';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';

interface GetTransactionsAdminDto {
  page: number;
  limit: number;
  status?: 'pending' | 'success' | 'failed';
  userIdOrEmail?: string;
}

@Injectable()
export class GetTransactionsAdminUseCase {
  constructor(private readonly txRepo: TransactionRepository) {}

  async execute(params: GetTransactionsAdminDto): Promise<{
    items: TransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.txRepo.findWithFilters(params);
  }
}
