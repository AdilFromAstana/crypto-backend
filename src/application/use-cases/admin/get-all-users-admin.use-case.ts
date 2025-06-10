import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetAllUsersAdminUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly txRepo: TransactionRepository,
  ) {}

  async execute() {
    const users = await this.userRepo.findAll();

    return Promise.all(
      users.map(async (user) => {
        const txCount = await this.txRepo.countByUserId(user.id);
        return {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          wallets: user.wallets.length,
          transactions: txCount,
        };
      }),
    );
  }
}
