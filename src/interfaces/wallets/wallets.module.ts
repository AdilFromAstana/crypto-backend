import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from 'src/domain/repositories/wallet.repository';
import { WalletRepositoryImpl } from 'src/infrastructure/repositories/wallet.repository.impl';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { User } from 'src/infrastructure/entities/user.orm-entity';
import { Wallet } from 'src/infrastructure/entities/wallet.orm-entity';
import { GetWalletsByUserUseCase } from 'src/application/use-cases/wallets/get-wallets-by-user.use-case';
import { CreateFiatWalletUseCase } from 'src/application/use-cases/wallets/create-fiat-wallet.use-case';
import { CreateCryptoWalletUseCase } from 'src/application/use-cases/wallets/create-crypto-wallet.use-case';
import { BitcoinWalletService } from 'src/application/service/bitcoin-wallet.service';
import { EthereumWalletService } from 'src/application/service/ethereum-wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User])],
  providers: [
    EthereumWalletService,
    BitcoinWalletService,
    {
      provide: WalletRepository,
      useClass: WalletRepositoryImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    GetWalletsByUserUseCase,
    CreateFiatWalletUseCase,
    CreateCryptoWalletUseCase,
  ],
  controllers: [WalletsController],
})
export class WalletsModule {}
