import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from './admin.controller';

// ORM-сущности
import { User } from '../infrastructure/entities/user.orm-entity';
import { Wallet } from '../infrastructure/entities/wallet.orm-entity';
import { Transaction } from '../infrastructure/entities/transaction.orm-entity';

// Use-cases
import { GetAllUsersAdminUseCase } from 'src/application/use-cases/admin/get-all-users-admin.use-case';
import { GetTransactionsAdminUseCase } from 'src/application/use-cases/admin/get-transactions-admin.use-case';
import { GetUserTransactionsAdminUseCase } from 'src/application/use-cases/admin/get-user-transactions-admin.use-case';
import { GetLogsUseCase } from 'src/application/use-cases/admin/get-logs.use-case';
import { ToggleBlockUserUseCase } from 'src/application/use-cases/admin/toggle-block-user.use-case';

// Репозитории
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository.impl';

import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { WalletRepositoryImpl } from '../infrastructure/repositories/wallet.repository.impl';

import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionRepositoryImpl } from '../infrastructure/repositories/transaction.repository.impl';

// Логи
import { LogsModule } from 'src/interfaces/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Transaction]), LogsModule],
  controllers: [AdminController],
  providers: [
    // Use-cases
    GetAllUsersAdminUseCase,
    GetTransactionsAdminUseCase,
    GetUserTransactionsAdminUseCase,
    GetLogsUseCase,
    ToggleBlockUserUseCase,

    // Репозитории
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    },
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl,
    },
  ],
})
export class AdminModule {}
