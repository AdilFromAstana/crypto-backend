export class EmailVerificationEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly code: string,
    public isUsed: boolean,
    public readonly createdAt: Date,
  ) {}

  markUsed() {
    this.isUsed = true;
  }
}
