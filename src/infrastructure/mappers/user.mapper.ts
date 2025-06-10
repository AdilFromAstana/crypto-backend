import { User } from '../entities/user.orm-entity';
import { UserEntity } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(record: User): UserEntity {
    return new UserEntity(
      record.id,
      record.email,
      record.name,
      record.passwordHash,
      record.isBlocked,
      record.wallets?.map((w) => w.id) || [],
      record.createdAt,
    );
  }

  static toOrm(entity: UserEntity): Partial<User> {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      passwordHash: entity.passwordHash,
      isBlocked: entity.isBlocked,
    };
  }
}
