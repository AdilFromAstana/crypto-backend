import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.orm-entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
    super();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['wallets'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repo.findOne({
      where: { email },
      relations: ['wallets'],
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: UserEntity): Promise<void> {
    const record = this.repo.create(UserMapper.toOrm(user));
    await this.repo.save(record);
  }

  async create(email: string, passwordHash: string): Promise<UserEntity> {
    const newUser = this.repo.create({
      email,
      name: '',
      passwordHash,
      isBlocked: false,
    });

    const saved = await this.repo.save(newUser);
    return UserMapper.toDomain(saved);
  }

  async findAll(): Promise<UserEntity[]> {
    const rows = await this.repo.find({ relations: ['wallets'] });
    return rows.map(UserMapper.toDomain);
  }
}
