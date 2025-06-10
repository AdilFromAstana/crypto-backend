import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('Пользователь уже существует');
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await this.userRepo.create(email, hash);

    const token = this.jwtService.sign(
      { userId: newUser.id },
      { expiresIn: '15m' },
    );

    return { access_token: token };
  }
}
