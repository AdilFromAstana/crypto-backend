import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { GetTransactionsByUserUseCase } from 'src/application/use-cases/admin/get-transactions-by-user.use-case';
import { ExchangeCurrencyUseCase } from 'src/application/use-cases/transactions/exchange-between-own-wallets.use-case';
import { GetTransactionsUseCase } from 'src/application/use-cases/transactions/get-transactions.use-case';
import { SendTokenToUserUseCase } from 'src/application/use-cases/transactions/send-token-to-user.use-case';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionRepositoryImpl } from 'src/infrastructure/repositories/transaction.repository.impl';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { WalletRepositoryImpl } from 'src/infrastructure/repositories/wallet.repository.impl';
import { LogsModule } from 'src/interfaces/logs/logs.module';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { User } from 'src/infrastructure/entities/user.orm-entity';
import { Transaction } from 'src/infrastructure/entities/transaction.orm-entity';
import { Wallet } from 'src/infrastructure/entities/wallet.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet, User]), LogsModule],
  controllers: [TransactionsController],
  providers: [
    GetTransactionsByUserUseCase,
    ExchangeCurrencyUseCase,
    GetTransactionsUseCase,
    SendTokenToUserUseCase,
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class TransactionsModule {}
