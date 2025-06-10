import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { GetLogsUseCase } from 'src/application/use-cases/admin/get-logs.use-case';
import { GetTransactionsAdminUseCase } from 'src/application/use-cases/admin/get-transactions-admin.use-case';
import { GetUserTransactionsAdminUseCase } from 'src/application/use-cases/admin/get-user-transactions-admin.use-case';
import { ToggleBlockUserUseCase } from 'src/application/use-cases/admin/toggle-block-user.use-case';
import { GetAllUsersAdminUseCase } from 'src/application/use-cases/admin/get-all-users-admin.use-case';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly getAllUsersAdminUseCase: GetAllUsersAdminUseCase,
    private readonly getTransactionsAdminUseCase: GetTransactionsAdminUseCase,
    private readonly getUserTransactionsAdminUseCase: GetUserTransactionsAdminUseCase,
    private readonly getLogsUseCase: GetLogsUseCase,
    private readonly toggleBlockUserUseCase: ToggleBlockUserUseCase,
  ) {}

  @Get('transactions')
  getTransactions(
    @Query('status') status?: 'pending' | 'success' | 'failed',
    @Query('user') user?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.getTransactionsAdminUseCase.execute({
      page: Number(page),
      limit: Number(limit),
      status,
      userIdOrEmail: user,
    });
  }

  @Get('users')
  getAllUsers() {
    return this.getAllUsersAdminUseCase.execute();
  }

  @Get('users/:id/transactions')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'type', enum: ['incoming', 'outgoing'], required: false })
  getUserTxs(
    @Param('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: 'incoming' | 'outgoing',
  ) {
    return this.getUserTransactionsAdminUseCase.execute({
      userId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sortBy: sortBy || 'createdAt',
      order: order || 'DESC',
      startDate,
      endDate,
      type,
    });
  }

  @Get('logs')
  getLogs(
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.getLogsUseCase.execute({
      type,
      userId,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Patch('users/:id/block')
  toggleBlock(@Param('id') userId: string, @Query('block') block: string) {
    return this.toggleBlockUserUseCase.execute(userId, block === 'true');
  }
}
