import { Injectable, ConflictException } from '@nestjs/common';
import { EmailVerificationRepository } from 'src/domain/repositories/email-verification.repository';
import { EmailService } from 'src/infrastructure/services/email.service';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { EmailVerificationEntity } from 'src/domain/entities/email-verification.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly emailRepo: EmailVerificationRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string, password: string): Promise<{ message: string }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictException('Пользователь уже зарегистрирован');
    }

    // Генерируем код и сохраняем в email_verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const verification = new EmailVerificationEntity(
      randomUUID(),
      email,
      code,
      false,
      new Date(),
    );

    await this.emailRepo.create(verification);
    await this.emailService.sendVerificationCode(email, code);

    return {
      message:
        'Код отправлен на почту. Завершите регистрацию через подтверждение.',
    };
  }
}
