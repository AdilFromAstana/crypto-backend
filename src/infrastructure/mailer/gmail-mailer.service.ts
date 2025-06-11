import { Injectable } from '@nestjs/common';

@Injectable()
export class GmailMailerService {
  async send({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }) {
    // временно просто лог
    console.log(`[MAIL] To: ${to}, Subject: ${subject}, Text: ${text}`);
  }
}
