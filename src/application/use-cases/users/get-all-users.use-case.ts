import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepo.findAll();
  }
}
