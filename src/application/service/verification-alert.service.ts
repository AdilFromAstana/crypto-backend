import { Injectable } from '@nestjs/common';
import { GmailMailerService } from 'src/infrastructure/mailer/gmail-mailer.service';
import { TRANSFER_LIMITS } from '../config/transfer-limits';

@Injectable()
export class VerificationAlertService {
  constructor(private readonly mailer: GmailMailerService) {}

  async notifyVerificationRequired(userEmail: string, amount: number) {
    if (amount >= TRANSFER_LIMITS.VERIFICATION_THRESHOLD) {
      await this.mailer.send({
        to: userEmail,
        subject: 'Необходима верификация перевода',
        text: `Пользователь пытается отправить ${amount} USD. Проверьте его вручную.`,
      });
    }
  }
}
