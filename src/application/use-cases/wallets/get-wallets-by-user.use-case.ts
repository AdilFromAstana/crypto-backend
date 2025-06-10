import { Injectable } from '@nestjs/common';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';

@Injectable()
export class GetWalletsByUserUseCase {
  constructor(private readonly walletRepo: WalletRepository) {}

  async execute(userId: string): Promise<WalletEntity[]> {
    return this.walletRepo.findByUserId(userId);
  }
}
