import { Injectable, BadRequestException } from '@nestjs/common';
import { EmailVerificationRepository } from '../../../domain/repositories/email-verification.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ConfirmRegistrationUseCase {
  constructor(
    private readonly verificationRepo: EmailVerificationRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(email: string, code: string, password: string): Promise<void> {
    const record = await this.verificationRepo.findValid(email, code);
    if (!record) throw new BadRequestException('Неверный код');

    await this.verificationRepo.markUsed(record.id);

    const hashed = await bcrypt.hash(password, 10);
    const user = new UserEntity(
      randomUUID(),
      email,
      '', // name
      hashed,
      false, // isBlocked
      [], // wallets
      new Date(), // createdAt
    );

    await this.userRepo.save(user);
  }
}
