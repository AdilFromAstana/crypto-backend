import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.orm-entity';

export type TxStatus = 'pending' | 'success' | 'failed';
export type TxType = 'send' | 'receive' | 'exchange' | 'internal';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromWalletId: string;

  @Column()
  toWalletId: string;

  @ManyToOne(() => Wallet, { eager: false })
  @JoinColumn({ name: 'fromWalletId' })
  fromWallet: Wallet;

  @ManyToOne(() => Wallet, { eager: false })
  @JoinColumn({ name: 'toWalletId' })
  toWallet: Wallet;

  @Column()
  fromAddress: string;

  @Column()
  toAddress: string;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @Column({ type: 'enum', enum: ['pending', 'success', 'failed'] })
  status: TxStatus;

  @Column({ type: 'enum', enum: ['send', 'receive', 'exchange', 'internal'] })
  type: TxType;

  @Column()
  fromToken: string;

  @Column()
  toToken: string;

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  exchangeRate: number;

  @Column({ nullable: true })
  txHash: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
