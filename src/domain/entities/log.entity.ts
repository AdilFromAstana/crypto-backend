export class LogEntity {
  constructor(
    public readonly id: string,
    public readonly type: 'info' | 'warning' | 'error',
    public readonly message: string,
    public readonly context?: any,
    public readonly createdAt: Date = new Date(),
  ) {}
}
