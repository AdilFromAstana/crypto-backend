import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { LogsService } from 'src/interfaces/logs/logs.service';

@Injectable()
export class ToggleBlockUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logsService: LogsService,
  ) {}

  async execute(userId: string, block: boolean) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.setBlocked(block);
    await this.userRepo.save(user);

    await this.logsService.log(
      block ? 'user_blocked' : 'user_unblocked',
      { userId },
      'admin',
    );

    return { message: `User ${block ? 'blocked' : 'unblocked'} successfully.` };
  }
}
