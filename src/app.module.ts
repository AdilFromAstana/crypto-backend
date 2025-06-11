import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './interfaces/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './interfaces/wallets/wallets.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './interfaces/transactions/transactions.module';
import { LogsModule } from './interfaces/logs/logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './interfaces/admin/admin.module';
import { AuthModule } from './interfaces/auth/auth.module';
import { TokenModule } from './interfaces/token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    WalletsModule,
    TransactionsModule,
    LogsModule,
    AdminModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
