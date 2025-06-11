import { EmailVerification } from '../entities/email-verification.orm-entity';
import { EmailVerificationEntity } from '../../domain/entities/email-verification.entity';

export class EmailVerificationMapper {
  static toDomain(record: EmailVerification): EmailVerificationEntity {
    return new EmailVerificationEntity(
      record.id,
      record.email,
      record.code,
      record.isUsed,
      record.createdAt,
    );
  }

  static toOrm(entity: EmailVerificationEntity): Partial<EmailVerification> {
    return {
      id: entity.id,
      email: entity.email,
      code: entity.code,
      isUsed: entity.isUsed,
      createdAt: entity.createdAt,
    };
  }
}
