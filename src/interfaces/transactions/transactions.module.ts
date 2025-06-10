import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '../infrastructure/entities/transaction.orm-entity';
import { Wallet } from '../infrastructure/entities/wallet.orm-entity';
import { TransactionsController } from './transactions.controller';

// use-cases
import { SendEthUseCase } from 'src/application/use-cases/transactions/send-eth.use-case';
import { GetTransactionsByUserUseCase } from 'src/application/use-cases/admin/get-transactions-by-user.use-case';

// репозитории
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionRepositoryImpl } from 'src/infrastructure/repositories/transaction.repository.impl';

import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { WalletRepositoryImpl } from 'src/infrastructure/repositories/wallet.repository.impl';

// сервис логов
import { LogsModule } from 'src/interfaces/logs/logs.module';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { User } from 'src/infrastructure/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet, User]), LogsModule],
  controllers: [TransactionsController],
  providers: [
    SendEthUseCase,
    GetTransactionsByUserUseCase,
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    },
    {
      provide: UserRepository, // ← ОБЯЗАТЕЛЬНО, иначе Nest не сможет создать TransactionRepositoryImpl
      useClass: UserRepositoryImpl,
    },
  ],
})
export class TransactionsModule {}
