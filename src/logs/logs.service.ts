// src/logs/logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogEvent, LogEventDocument } from './schemas/log-event.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(LogEvent.name) private logModel: Model<LogEventDocument>,
  ) {}

  async log(type: string, data?: Record<string, any>, userId?: string) {
    return this.logModel.create({ type, data, userId });
  }

  async getLogs({
    type,
    userId,
    page = 1,
    limit = 20,
  }: {
    type?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = {};
    if (type) query.type = type;
    if (userId) query.userId = userId;

    return this.logModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
}
