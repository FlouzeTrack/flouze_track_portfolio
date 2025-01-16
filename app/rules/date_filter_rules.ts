import type { EthereumTransaction } from '#types/etherscan'

export interface FilterRule {
  isValid(transaction: EthereumTransaction): boolean
}

export class DateFilterRule implements FilterRule {
  constructor(
    private readonly startDate?: string,
    private readonly endDate?: string
  ) {}

  private get startTimestamp(): number | undefined {
    return this.startDate ? Math.floor(new Date(this.startDate).getTime() / 1000) : undefined
  }

  private get endTimestamp(): number | undefined {
    return this.endDate ? Math.floor(new Date(this.endDate).getTime() / 1000) : undefined
  }

  public isValid(transaction: EthereumTransaction): boolean {
    const txTimestamp = Number(transaction.timeStamp)

    if (this.startTimestamp && txTimestamp < this.startTimestamp) return false
    if (this.endTimestamp && txTimestamp > this.endTimestamp + 86400) return false

    return true
  }
}
