import { WalletEntity } from '../entities/wallet.entity';

export abstract class WalletRepository {
  abstract findById(id: string): Promise<WalletEntity | null>;
  abstract findByAddress(address: string): Promise<WalletEntity | null>;
  abstract save(wallet: WalletEntity): Promise<void>;
  abstract findByUserId(userId: string): Promise<WalletEntity[]>;
}
