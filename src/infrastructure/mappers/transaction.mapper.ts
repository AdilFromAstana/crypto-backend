import { Transaction } from '../entities/transaction.orm-entity';
import { TransactionEntity } from '../../domain/entities/transaction.entity';

export class TransactionMapper {
  static toDomain(record: Transaction): TransactionEntity {
    return new TransactionEntity(
      record.id,
      Number(record.amount),
      record.status,
      record.txHash,
      record.toWalletId,
      record.fromWalletId,
      record.toAddress,
      record.fromAddress,
      record.createdAt,
    );
  }

  static toOrm(entity: TransactionEntity): Partial<Transaction> {
    return {
      id: entity.id,
      fromWalletId: entity.fromWalletId,
      toWalletId: entity.toWalletId,
      toAddress: entity.toAddress,
      fromAddress: entity.fromAddress,
      amount: entity.amount,
      status: entity.status,
      txHash: entity.txHash,
      createdAt: entity.createdAt,
    };
  }
}
