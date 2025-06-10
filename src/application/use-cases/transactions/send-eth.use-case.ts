import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { LogsService } from 'src/interfaces/logs/logs.service';

@Injectable()
export class SendEthUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly transactionRepo: TransactionRepository,
    private readonly logsService: LogsService,
  ) {}

  async execute({
    fromWalletId,
    toWalletId,
    amount,
    userId,
  }: {
    fromWalletId: string;
    toWalletId: string;
    amount: string;
    userId: string;
  }) {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0)
      throw new BadRequestException('Invalid amount');

    const senderWallet = await this.walletRepo.findById(fromWalletId);
    if (!senderWallet) throw new NotFoundException('Sender wallet not found');

    if (senderWallet.userId !== userId)
      throw new ForbiddenException('Access denied');

    if (senderWallet.id === toWalletId)
      throw new BadRequestException('Cannot send to same wallet');

    if (!senderWallet.canDebit(value))
      throw new ForbiddenException('Insufficient balance');

    const receiverWallet = await this.walletRepo.findById(toWalletId);
    if (!receiverWallet)
      throw new NotFoundException('Receiver wallet not found');

    // Обновляем балансы через доменные методы
    senderWallet.debit(value);
    receiverWallet.credit(value);

    await this.walletRepo.save(senderWallet);
    await this.walletRepo.save(receiverWallet);

    const fakeTxHash = '0x' + randomBytes(32).toString('hex');

    const createTransaction = TransactionEntity.createTransaction(
      senderWallet.id, // fromWalletId
      receiverWallet.id, // toWalletId
      receiverWallet.address, // toAddress
      senderWallet.address, // fromAddress
      value, // amount
      fakeTxHash, // txHash
    );

    await this.transactionRepo.save(createTransaction);

    await this.logsService.log(
      'tx_sent_mock',
      {
        from: senderWallet.address,
        to: receiverWallet.address,
        amount: value,
        txHash: fakeTxHash,
      },
      userId,
    );

    return createTransaction;
  }
}
