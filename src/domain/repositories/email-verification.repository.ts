import { EmailVerificationEntity } from 'src/domain/entities/email-verification.entity';
export const EMAIL_VERIFICATION_REPOSITORY = Symbol('EMAIL_VERIFICATION_REPOSITORY');

export interface EmailVerificationRepository {
  create(entity: EmailVerificationEntity): Promise<void>;
  findValid(
    email: string,
    code: string,
  ): Promise<EmailVerificationEntity | null>;
  markUsed(id: string): Promise<void>;
}
