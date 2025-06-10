export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
    public isBlocked: boolean,
    public readonly wallets: string[],
    public readonly createdAt: Date,
  ) {}

  setBlocked(block: boolean) {
    this.isBlocked = block;
  }
}
