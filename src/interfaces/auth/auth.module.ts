import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { LoginUseCase } from 'src/application/use-cases/auth/login.use-case';
import { RegisterUseCase } from 'src/application/use-cases/auth/register.use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/auth/refresh-token.use-case';
import { User } from 'src/infrastructure/entities/user.orm-entity';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { EmailService } from 'src/infrastructure/services/email.service';
import { EmailVerificationRepositoryImpl } from 'src/infrastructure/repositories/email-verification.repository.impl';
import { SendVerificationCodeUseCase } from 'src/application/use-cases/auth/send-verification-code.use-case';
import { ConfirmRegistrationUseCase } from 'src/application/use-cases/auth/confirm-registration.use-case';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES') || '3600s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtService,
    LoginUseCase,
    RegisterUseCase,
    RefreshTokenUseCase,
    EmailService,
    SendVerificationCodeUseCase,
    ConfirmRegistrationUseCase,

    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: EmailVerificationRepositoryImpl,
      useClass: EmailVerificationRepositoryImpl,
    },
  ],
})
export class AuthModule {}
