import { randomUUID } from 'crypto';

export type TxStatus = 'success' | 'failed' | 'pending';
export type TxType = 'send' | 'receive' | 'exchange' | 'internal';

export class TransactionEntity {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public status: TxStatus,
    public readonly fromWalletId: string,
    public readonly toWalletId: string,
    public readonly fromAddress: string | null,
    public readonly toAddress: string | null,
    public readonly createdAt: Date,
    public readonly type: TxType,
    public readonly fromToken: string,
    public readonly toToken: string,
    public readonly exchangeRate?: number,
    public readonly txHash?: string,
    public readonly note?: string,
  ) {}

  confirm() {
    this.status = 'success';
  }

  fail() {
    this.status = 'failed';
  }

  static create(params: {
    type: TxType;
    amount: number;
    fromWalletId: string;
    toWalletId: string;
    fromToken: string;
    toToken: string;
    fromAddress?: string | null;
    toAddress?: string | null;
    exchangeRate?: number;
    txHash?: string;
    note?: string;
  }): TransactionEntity {
    return new TransactionEntity(
      randomUUID(),
      params.amount,
      'success',
      params.fromWalletId,
      params.toWalletId,
      params.fromAddress ?? null,
      params.toAddress ?? null,
      new Date(),
      params.type,
      params.fromToken,
      params.toToken,
      params.exchangeRate,
      params.txHash,
      params.note,
    );
  }
}
