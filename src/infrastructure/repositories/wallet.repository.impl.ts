import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.orm-entity';
import { WalletRepository } from '../../domain/repositories/wallet.repository';
import { WalletEntity } from '../../domain/entities/wallet.entity';
import { WalletMapper } from '../mappers/wallet.mapper';

@Injectable()
export class WalletRepositoryImpl extends WalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly repo: Repository<Wallet>,
  ) {
    super();
  }

  async findById(id: string): Promise<WalletEntity | null> {
    const wallet = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    return wallet ? WalletMapper.toDomain(wallet) : null;
  }

  async findByAddress(address: string): Promise<WalletEntity | null> {
    const wallet = await this.repo.findOne({
      where: { address },
      relations: ['user'],
    });
    return wallet ? WalletMapper.toDomain(wallet) : null;
  }

  async save(entity: WalletEntity): Promise<void> {
    const record = this.repo.create(WalletMapper.toOrm(entity));
    await this.repo.save(record);
  }

  async findByUserId(userId: string): Promise<WalletEntity[]> {
    const wallets = await this.repo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return wallets.map(WalletMapper.toDomain);
  }
}
