import { Wallet } from '../entities/wallet.orm-entity';
import { WalletEntity } from '../../domain/entities/wallet.entity';

export class WalletMapper {
  static toDomain(record: Wallet): WalletEntity {
    return new WalletEntity(
      record.id,
      record.userId, // ✅ теперь это корректно
      record.tokenSymbol,
      record.type,
      record.network,
      record.address ?? null,
      record.encryptedPrivateKey ?? null,
      Number(record.balance),
      record.lastKnownBalance,
      record.label,
    );
  }

  static toOrm(entity: WalletEntity): Partial<Wallet> {
    return {
      id: entity.id,
      userId: entity.userId, // ✅ добавляем обратно в ORM
      tokenSymbol: entity.tokenSymbol,
      type: entity.type,
      network: entity.network,
      address: entity.address,
      encryptedPrivateKey: entity.encryptedPrivateKey,
      balance: entity.balance,
      lastKnownBalance: entity.lastKnownBalance,
      label: entity.label,
    };
  }
}
