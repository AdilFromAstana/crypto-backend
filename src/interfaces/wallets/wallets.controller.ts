// src/interfaces/controllers/wallets.controller.ts
import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateCryptoWalletUseCase } from 'src/application/use-cases/wallets/create-crypto-wallet.use-case';
import { CreateFiatWalletUseCase } from 'src/application/use-cases/wallets/create-fiat-wallet.use-case';
import { GetWalletsByUserUseCase } from 'src/application/use-cases/wallets/get-wallets-by-user.use-case';
import { CreateCryptoWalletDto } from './dto/create-crypto-wallet.dto';
import { CreateFiatWalletDto } from './dto/create-fiat-wallet.dto';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly createCryptoWallet: CreateCryptoWalletUseCase,
    private readonly createFiatWallet: CreateFiatWalletUseCase,
    private readonly getWalletsByUser: GetWalletsByUserUseCase,
  ) {}

  @Post('crypto')
  @ApiOperation({ summary: 'Создать крипто-кошелёк' })
  @ApiBody({ type: CreateCryptoWalletDto })
  async createCrypto(@Req() req, @Body() body: CreateCryptoWalletDto) {
    return this.createCryptoWallet.execute({
      userId: req.user.userId,
      tokenSymbol: body.tokenSymbol,
      network: body.network,
      label: body.label,
    });
  }

  @Post('fiat')
  @ApiOperation({ summary: 'Создать фиатный кошелёк' })
  @ApiBody({ type: CreateFiatWalletDto })
  async createFiat(@Req() req, @Body() body: CreateFiatWalletDto) {
    return this.createFiatWallet.execute({
      userId: req.user.userId,
      tokenSymbol: body.tokenSymbol,
      label: body.label,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Получить все кошельки пользователя' })
  async getMyWallets(@Req() req) {
    return this.getWalletsByUser.execute(req.user.userId);
  }
}
