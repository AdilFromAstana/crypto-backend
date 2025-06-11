import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';

interface SendTokenToUserInput {
  fromWalletId: string;
  toWalletId: string;
  userId: string; // отправитель
  amount: number;
  note?: string;
}

@Injectable()
export class SendTokenToUserUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly transactionRepo: TransactionRepository,
  ) {}

  async execute(input: SendTokenToUserInput): Promise<{ success: true }> {
    const { fromWalletId, toWalletId, userId, amount, note } = input;

    const fromWallet = await this.walletRepo.findById(fromWalletId);
    const toWallet = await this.walletRepo.findById(toWalletId);

    if (!fromWallet || !toWallet) {
      throw new NotFoundException('Один из кошельков не найден');
    }

    if (fromWallet.userId !== userId) {
      throw new ForbiddenException('Нельзя отправлять с чужого кошелька');
    }

    if (toWallet.userId === userId) {
      throw new BadRequestException(
        'Используй internal transfer для своих кошельков',
      );
    }

    if (fromWallet.tokenSymbol !== toWallet.tokenSymbol) {
      throw new BadRequestException(
        'Нельзя отправить токен с несовпадающим типом',
      );
    }

    if (fromWallet.network !== toWallet.network) {
      throw new BadRequestException('Сеть (network) должна совпадать');
    }

    if (!fromWallet.canDebit(amount)) {
      throw new BadRequestException('Недостаточно средств');
    }

    fromWallet.debit(amount);
    toWallet.credit(amount);

    await this.walletRepo.save(fromWallet);
    await this.walletRepo.save(toWallet);

    const tx = TransactionEntity.create({
      type: 'send',
      fromWalletId,
      toWalletId,
      fromToken: fromWallet.tokenSymbol,
      toToken: toWallet.tokenSymbol,
      fromAddress: fromWallet.address,
      toAddress: toWallet.address,
      amount,
      txHash: this.generateFakeTxHash(),
      note,
    });

    await this.transactionRepo.save(tx);

    return { success: true };
  }

  private generateFakeTxHash(): string {
    return '0x' + Math.random().toString(16).substring(2).padEnd(64, '0');
  }
}
