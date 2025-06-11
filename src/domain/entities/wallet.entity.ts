export class WalletEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly tokenSymbol: string, // 'ETH', 'USD'
    public readonly type: 'crypto' | 'fiat',
    public readonly network: string | null,
    public readonly address: string | null,
    public readonly encryptedPrivateKey: string | null,
    public balance: number,
    public lastKnownBalance: string,
    public readonly label: string, // ✅ Добавлено
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
