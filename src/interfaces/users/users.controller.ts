import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUserByIdUseCase } from 'src/application/use-cases/users/get-user-by-id.use-case';
import { GetAllUsersUseCase } from 'src/application/use-cases/users/get-all-users.use-case';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserById: GetUserByIdUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
  ) {}

  @Get('me')
  async getProfile(@Req() req) {
    return this.getUserById.execute(req.user.userId);
  }

  @Get()
  async getAll() {
    return this.getAllUsers.execute();
  }
}
