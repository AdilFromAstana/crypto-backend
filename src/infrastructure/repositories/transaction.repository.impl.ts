import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.orm-entity';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { User } from '../entities/user.orm-entity';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async save(entity: TransactionEntity): Promise<void> {
    console.log('entity: ', entity);
    const record = this.repo.create(TransactionMapper.toOrm(entity));
    console.log('record: ', record);
    await this.repo.save(record);
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const record = await this.repo.findOne({ where: { id } });
    return record ? TransactionMapper.toDomain(record) : null;
  }

  async findByWalletIdWithFilters(params: {
    walletId: string;
    page: number;
    limit: number;
    status?: 'pending' | 'success' | 'failed';
    order?: 'ASC' | 'DESC';
  }): Promise<{
    items: TransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { walletId, page, limit, status, order = 'DESC' } = params;

    const qb = this.repo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.fromWallet', 'fromWallet')
      .leftJoinAndSelect('fromWallet.user', 'fromUser')
      .leftJoinAndSelect('tx.toWallet', 'toWallet')
      .leftJoinAndSelect('toWallet.user', 'toUser')
      .where('tx.fromWalletId = :walletId OR tx.toWalletId = :walletId', {
        walletId,
      });

    if (status) {
      qb.andWhere('tx.status = :status', { status });
    }

    qb.orderBy('tx.createdAt', order)
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      items: rows.map(TransactionMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async findAllByUser(userId: string): Promise<TransactionEntity[]> {
    const rows = await this.repo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.wallet', 'wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('tx.createdAt', 'DESC')
      .getMany();

    return rows.map((tx) => TransactionMapper.toDomain(tx));
  }

  async findWithFilters(params: {
    page: number;
    limit: number;
    status?: 'pending' | 'success' | 'failed';
    userIdOrEmail?: string;
  }): Promise<{
    items: TransactionEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, status, userIdOrEmail } = params;
    console.log('userIdOrEmail: ', userIdOrEmail);

    const qb = this.repo
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.wallet', 'wallet')
      .leftJoinAndSelect('wallet.user', 'user');

    if (status) {
      qb.andWhere('tx.status = :status', { status });
    }

    if (userIdOrEmail) {
      const user = await this.userRepo.findOne({
        where: [{ id: userIdOrEmail }],
      });

      if (!user) {
        return { items: [], total: 0, page, limit };
      }

      qb.andWhere('user.id = :userId', { userId: user.id });
    }

    qb.orderBy('tx.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      items: rows.map(TransactionMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repo
      .createQueryBuilder('tx')
      .leftJoin('tx.wallet', 'wallet')
      .leftJoin('wallet.user', 'user')
      .where('user.id = :userId', { userId })
      .getCount();
  }

  async getTotalSentPerDay(
    userId: string,
    tokenSymbol: string,
  ): Promise<number> {
    const { sum } = await this.repo
      .createQueryBuilder('tx')
      .leftJoin('tx.fromWallet', 'fromWallet')
      .leftJoin('fromWallet.user', 'user')
      .select('SUM(tx.amount)', 'sum')
      .where('user.id = :userId', { userId })
      .andWhere('tx.tokenSymbol = :tokenSymbol', { tokenSymbol })
      .andWhere('tx.createdAt BETWEEN :start AND :end', {
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
      })
      .getRawOne();

    return parseFloat(sum) || 0;
  }

  async getTotalSentPerMonth(
    userId: string,
    tokenSymbol: string,
  ): Promise<number> {
    const { sum } = await this.repo
      .createQueryBuilder('tx')
      .leftJoin('tx.fromWallet', 'fromWallet')
      .leftJoin('fromWallet.user', 'user')
      .select('SUM(tx.amount)', 'sum')
      .where('user.id = :userId', { userId })
      .andWhere('tx.tokenSymbol = :tokenSymbol', { tokenSymbol })
      .andWhere('tx.createdAt BETWEEN :start AND :end', {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      })
      .getRawOne();

    return parseFloat(sum) || 0;
  }

  async getTotalToRecipientToday(
    senderId: string,
    recipientId: string,
    tokenSymbol: string,
  ): Promise<number> {
    const { sum } = await this.repo
      .createQueryBuilder('tx')
      .select('SUM(tx.amount)', 'sum')
      .where('tx.fromUserId = :senderId', { senderId })
      .andWhere('tx.toUserId = :recipientId', { recipientId })
      .andWhere('tx.tokenSymbol = :tokenSymbol', { tokenSymbol })
      .andWhere('tx.createdAt BETWEEN :start AND :end', {
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
      })
      .getRawOne();

    return parseFloat(sum) || 0;
  }
}
