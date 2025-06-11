import { Injectable } from '@nestjs/common';
import { EmailVerificationRepository } from '../../../domain/repositories/email-verification.repository';
import { EmailVerificationEntity } from '../../../domain/entities/email-verification.entity';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/infrastructure/services/email.service';

@Injectable()
export class SendVerificationCodeUseCase {
  constructor(
    private readonly repo: EmailVerificationRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const entity = new EmailVerificationEntity(
      randomUUID(),
      email,
      code,
      false,
      new Date(),
    );

    await this.repo.create(entity);
    await this.emailService.sendVerificationCode(email, code);
  }
}
