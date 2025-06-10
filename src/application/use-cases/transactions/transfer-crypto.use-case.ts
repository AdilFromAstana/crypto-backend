import { randomBytes } from 'crypto';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';

export class TransferCryptoUseCase {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly txRepo: TransactionRepository,
  ) {}

  async execute(fromWalletId: string, toWalletId: string, amount: number) {
    const senderWallet = await this.walletRepo.findById(fromWalletId);
    const receiverWallet = await this.walletRepo.findById(toWalletId);

    if (!senderWallet || !receiverWallet) throw new Error('Wallet not found');
    if (!senderWallet.canDebit(amount)) throw new Error('Insufficient balance');

    senderWallet.debit(amount);
    receiverWallet.credit(amount);

    await this.walletRepo.save(senderWallet);
    await this.walletRepo.save(receiverWallet);

    const txHash = '0x' + randomBytes(32).toString('hex');

    const createTransaction = TransactionEntity.createTransaction(
      senderWallet.id, // fromWalletId
      receiverWallet.id, // toWalletId
      receiverWallet.address, // toAddress
      senderWallet.address, // fromAddress
      amount, // amount
      txHash, // txHash
    );

    await this.txRepo.save(createTransaction);

    return createTransaction;
  }
}
