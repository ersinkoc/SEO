export class RateLimiter {
  private readonly calls: number[] = [];

  public constructor(
    private readonly maxCalls: number,
    private readonly windowMs: number
  ) {}

  public allow(now = Date.now()): boolean {
    while (this.calls.length > 0 && now - this.calls[0]! > this.windowMs) {
      this.calls.shift();
    }
    if (this.calls.length >= this.maxCalls) {
      return false;
    }
    this.calls.push(now);
    return true;
  }
}

