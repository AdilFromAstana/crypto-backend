import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.orm-entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenSymbol: string; // 'BTC', 'ETH', 'USDT', 'USD'

  @Column({ type: 'varchar' })
  type: 'crypto' | 'fiat';

  @Column({ nullable: true })
  network: string; // 'ethereum', 'tron', null для фиата

  @Column({ unique: true, nullable: true })
  address: string; // Только для крипты

  @Column({ nullable: true })
  encryptedPrivateKey: string; // Только для крипты

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  balance: number;

  @Column({ type: 'numeric', default: 0 })
  lastKnownBalance: string;

  @Column()
  label: string; // ✅ добавлено — например: "Основной", "Банковский", "Крипто 1"

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column()
  userId: string; // 👈 обязательно, чтобы userId был доступен напрямую

  @CreateDateColumn()
  createdAt: Date;
}
