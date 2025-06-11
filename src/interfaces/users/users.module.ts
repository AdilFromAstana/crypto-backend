import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { GetUserByIdUseCase } from 'src/application/use-cases/users/get-user-by-id.use-case';
import { GetAllUsersUseCase } from 'src/application/use-cases/users/get-all-users.use-case';
import { User } from 'src/infrastructure/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UsersModule {}
