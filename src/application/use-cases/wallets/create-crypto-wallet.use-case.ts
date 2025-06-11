import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { v4 as uuid } from 'uuid';
import { EthereumWalletService } from 'src/application/service/ethereum-wallet.service';
import { BitcoinWalletService } from 'src/application/service/bitcoin-wallet.service';

interface CreateCryptoWalletInput {
  userId: string;
  tokenSymbol: string; // ETH, USDT, BTC и т.п.
  network: string; // ethereum, polygon и т.п.
  label?: string;
}

@Injectable()
export class CreateCryptoWalletUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly userRepo: UserRepository,
    private readonly ethWalletService: EthereumWalletService,
    private readonly btcWalletService: BitcoinWalletService,
  ) {}

  async execute(input: CreateCryptoWalletInput): Promise<WalletEntity> {
    const { userId, tokenSymbol, network, label } = input;

    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    // 🔒 Проверка лимита на количество кошельков
    const existing = await this.walletRepo.findAllByUserAndToken(
      userId,
      tokenSymbol,
    );
    if (existing.length >= 2) {
      throw new BadRequestException(
        `Вы не можете создать более 2 криптокошельков для ${tokenSymbol}`,
      );
    }

    // 🧠 Генерация адреса и ключа
    let address: string;
    let encryptedPrivateKey: string;

    if (tokenSymbol === 'BTC') {
      const btcWallet = await this.btcWalletService.generateWallet();
      address = btcWallet.address;
      encryptedPrivateKey = btcWallet.encryptedPrivateKey;
    } else {
      const ethWallet = await this.ethWalletService.generateWallet();
      address = ethWallet.address;
      encryptedPrivateKey = ethWallet.encryptedPrivateKey;
    }

    // 🧱 Сборка и сохранение сущности
    const wallet = new WalletEntity(
      uuid(),
      user.id,
      tokenSymbol,
      'crypto',
      network,
      address,
      encryptedPrivateKey,
      0,
      '0',
      label ?? `Кошелёк ${existing.length + 1}`,
    );
    console.log('wallet: ', wallet);

    await this.walletRepo.save(wallet);
    return wallet;
  }
}
