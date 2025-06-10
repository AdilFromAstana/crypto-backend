export class WalletEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly address: string,
    public readonly encryptedPrivateKey: string,
    public readonly blockchain: string,
    public balance: number,
    public lastKnownBalance: string,
  ) {}

  debit(amount: number): void {
    if (this.balance < amount) {
      throw new Error('Недостаточно средств');
    }
    this.balance -= amount;
  }

  credit(amount: number): void {
    this.balance += amount;
  }

  canDebit(amount: number): boolean {
    return this.balance >= amount;
  }
}
