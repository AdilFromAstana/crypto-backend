import { randomUUID } from 'crypto';

export type TxStatus = 'success' | 'failed' | 'pending';
export type TxType = 'incoming' | 'outgoing';

export class TransactionEntity {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public status: TxStatus,
    public readonly txHash: string,
    public readonly toWalletId: string,
    public readonly fromWalletId: string,
    public readonly toAddress: string,
    public readonly fromAddress: string,
    public readonly createdAt: Date,
  ) {}

  static createTransaction(
    fromWalletId: string,
    toWalletId: string,
    toAddress: string,
    fromAddress: string,
    amount: number,
    txHash: string,
  ): TransactionEntity {
    return new TransactionEntity(
      randomUUID(),
      amount,
      'success',
      txHash,
      toWalletId,
      fromWalletId,
      toAddress,
      fromAddress,
      new Date(),
    );
  }

  confirm() {
    this.status = 'success';
  }

  fail() {
    this.status = 'failed';
  }
}
