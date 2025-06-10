import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateWalletUseCase } from 'src/application/use-cases/wallets/create-wallet.use-case';
import { GetWalletsByUserUseCase } from 'src/application/use-cases/wallets/get-wallets-by-user.use-case';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly createWallet: CreateWalletUseCase,
    private readonly getWalletsByUser: GetWalletsByUserUseCase,
  ) {}

  @Post()
  async create(@Req() req) {
    return this.createWallet.execute(req.user.userId);
  }

  @Get()
  async getMyWallets(@Req() req) {
    return this.getWalletsByUser.execute(req.user.userId);
  }
}
