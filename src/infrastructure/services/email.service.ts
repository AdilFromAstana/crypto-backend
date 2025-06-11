// src/infrastructure/services/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendVerificationCode(to: string, code: string): Promise<void> {
    const subject = 'Подтверждение регистрации';
    const html = `<p>Ваш код подтверждения: <b>${code}</b></p>`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Crypto App" <no-reply@crypto.local>',
        to,
        subject,
        html,
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw new Error('Не удалось отправить письмо');
    }
  }
}
