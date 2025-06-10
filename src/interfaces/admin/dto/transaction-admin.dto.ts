import { Expose, Type } from 'class-transformer';

export class AdminUserDto {
  @Expose() id: string;
  @Expose() email: string;
}

export class AdminWalletDto {
  @Expose() id: string;
  @Expose() address: string;

  @Type(() => AdminUserDto)
  @Expose()
  user: AdminUserDto;
}

export class AdminTransactionDto {
  @Expose() id: string;
  @Expose() to: string;
  @Expose() amount: string;
  @Expose() txHash: string;
  @Expose() status: string;
  @Expose() retryCount: number;
  @Expose() createdAt: Date;

  @Type(() => AdminWalletDto)
  @Expose()
  wallet: AdminWalletDto;
}
