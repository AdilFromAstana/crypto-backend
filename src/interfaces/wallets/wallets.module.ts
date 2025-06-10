import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { WalletRepositoryImpl } from 'src/infrastructure/repositories/wallet.repository.impl';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { User } from 'src/infrastructure/entities/user.orm-entity';
import { Wallet } from 'src/infrastructure/entities/wallet.orm-entity';
import { CreateWalletUseCase } from 'src/application/use-cases/wallets/create-wallet.use-case';
import { GetWalletsByUserUseCase } from 'src/application/use-cases/wallets/get-wallets-by-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User])],
  providers: [
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    CreateWalletUseCase,
    GetWalletsByUserUseCase,
  ],
  controllers: [WalletsController],
})
export class WalletsModule {}
