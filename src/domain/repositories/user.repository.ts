import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract save(user: UserEntity): Promise<void>;
  abstract create(email: string, passwordHash: string): Promise<UserEntity>;
  abstract findAll(): Promise<UserEntity[]>;
}
