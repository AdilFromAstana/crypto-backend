import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
      ) as any;

      const user = await this.userRepo.findById(payload.userId);
      if (!user || user.isBlocked) {
        throw new UnauthorizedException();
      }

      const newToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '15m' },
      );

      return { access_token: newToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
