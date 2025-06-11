import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerificationRepository } from '../../domain/repositories/email-verification.repository';
import { EmailVerification } from '../entities/email-verification.orm-entity';
import { EmailVerificationEntity } from '../../domain/entities/email-verification.entity';
import { EmailVerificationMapper } from '../mappers/email-verification.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailVerificationRepositoryImpl
  implements EmailVerificationRepository
{
  constructor(
    @InjectRepository(EmailVerification)
    private readonly repo: Repository<EmailVerification>,
  ) {}

  async create(entity: EmailVerificationEntity): Promise<void> {
    const orm = this.repo.create(EmailVerificationMapper.toOrm(entity));
    await this.repo.save(orm);
  }

  async findValid(
    email: string,
    code: string,
  ): Promise<EmailVerificationEntity | null> {
    const found = await this.repo.findOne({
      where: { email, code, isUsed: false },
    });
    return found ? EmailVerificationMapper.toDomain(found) : null;
  }

  async markUsed(id: string): Promise<void> {
    await this.repo.update({ id }, { isUsed: true });
  }
}
