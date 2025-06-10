import { Injectable, NotFoundException } from '@nestjs/common';
import { ethers } from 'ethers';
import { encrypt } from 'src/common/crypto.util';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';

@Injectable()
export class CreateWalletUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string): Promise<WalletEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const newWallet = ethers.Wallet.createRandom();
    const encryptedKey = encrypt(newWallet.privateKey);

    const wallet = new WalletEntity(
      crypto.randomUUID(),
      user.id,
      newWallet.address,
      encryptedKey,
      'ethereum',
      0,
      '0',
    );

    await this.walletRepo.save(wallet);
    return wallet;
  }
}
