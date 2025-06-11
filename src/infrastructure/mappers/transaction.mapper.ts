import { Transaction } from '../entities/transaction.orm-entity';
import {
  TransactionEntity,
  TxType,
  TxStatus,
} from '../../domain/entities/transaction.entity';

export class TransactionMapper {
  static toDomain(record: Transaction): TransactionEntity {
    return new TransactionEntity(
      record.id,
      Number(record.amount),
      record.status as TxStatus,
      record.fromWalletId,
      record.toWalletId,
      record.fromAddress ?? null,
      record.toAddress ?? null,
      new Date(record.createdAt),
      record.type as TxType,
      record.fromToken,
      record.toToken,
      record.exchangeRate ?? undefined,
      record.txHash ?? undefined,
      record.note ?? undefined,
    );
  }

  static toOrm(entity: TransactionEntity): Partial<Transaction> {
    return {
      id: entity.id,
      amount: entity.amount,
      status: entity.status,
      fromWalletId: entity.fromWalletId,
      toWalletId: entity.toWalletId,
      fromAddress: entity.fromAddress,
      toAddress: entity.toAddress,
      createdAt: entity.createdAt,
      type: entity.type,
      fromToken: entity.fromToken,
      toToken: entity.toToken,
      exchangeRate: entity.exchangeRate,
      txHash: entity.txHash,
      note: entity.note,
    };
  }
}
