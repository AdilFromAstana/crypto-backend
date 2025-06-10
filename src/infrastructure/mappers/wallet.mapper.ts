import { Wallet } from '../entities/wallet.orm-entity';
import { WalletEntity } from '../../domain/entities/wallet.entity';

export class WalletMapper {
  static toDomain(record: Wallet): WalletEntity {
    return new WalletEntity(
      record.id,
      record.user.id,
      record.address,
      record.encryptedPrivateKey,
      record.blockchain,
      Number(record.balance),
      record.lastKnownBalance,
    );
  }

  static toOrm(entity: WalletEntity): Partial<Wallet> {
    return {
      id: entity.id,
      address: entity.address,
      encryptedPrivateKey: entity.encryptedPrivateKey,
      blockchain: entity.blockchain,
      balance: entity.balance,
      lastKnownBalance: entity.lastKnownBalance,
    };
  }
}
