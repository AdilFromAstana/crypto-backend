import { Injectable } from '@nestjs/common';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class GetLogsUseCase {
  constructor(private readonly logsService: LogsService) {}

  async execute(params: {
    type?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    return this.logsService.getLogs(params);
  }
}
