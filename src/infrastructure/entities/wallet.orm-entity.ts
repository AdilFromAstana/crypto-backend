import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from './transaction.orm-entity';
import { User } from './user.orm-entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  address: string;

  @Column()
  encryptedPrivateKey: string;

  @Column({ default: 'ethereum' })
  blockchain: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];

  @Column({ type: 'numeric', default: 0 })
  lastKnownBalance: string; // в ETH (в строке для высокой точности)

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  balance: number; // ← Добавлено поле
}
