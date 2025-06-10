import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Неверный пароль');

    const payload = { userId: user.id };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET, // секрет для access_token
      expiresIn: '15m', // время жизни access_token
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET, // секрет для refresh_token (другой, чем для access_token)
      expiresIn: '7d', // время жизни refresh_token
    });

    return { access_token, refresh_token };
  }
}
