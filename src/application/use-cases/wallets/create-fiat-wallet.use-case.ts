import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { WalletEntity } from 'src/domain/entities/wallet.entity';
import { v4 as uuid } from 'uuid';

interface CreateFiatWalletInput {
  userId: string;
  tokenSymbol: string; // USD, EUR и т.д.
  label?: string; // 'Личный', 'Общий' и т.п.
}

@Injectable()
export class CreateFiatWalletUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: CreateFiatWalletInput): Promise<WalletEntity> {
    const { userId, tokenSymbol, label } = input;

    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const existing = await this.walletRepo.findAllByUserAndToken(
      userId,
      tokenSymbol,
    );
    if (existing.length >= 2) {
      throw new BadRequestException(
        `Вы не можете создать более 2 кошельков для ${tokenSymbol}`,
      );
    }

    const wallet = new WalletEntity(
      uuid(),
      user.id,
      tokenSymbol,
      'fiat',
      null,
      `fiat-${tokenSymbol.toLowerCase()}-${uuid().slice(0, 8)}`,
      null,
      0,
      '0',
      label ?? `Кошелёк ${existing.length + 1}`,
    );
    console.log('wallet: ', wallet);

    await this.walletRepo.save(wallet);
    return wallet;
  }
}
