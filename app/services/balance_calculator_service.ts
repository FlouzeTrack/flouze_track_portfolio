import type { EthereumTransaction } from '#types/etherscan'
import type { BalanceHistory } from '#types/wallet'
import { formatTimestamp } from '#utils/date'
import { DateFilterRule } from '#rules/date_filter_rules'

export class BalanceCalculator {
  constructor(
    private readonly address: string,
    private readonly startDate?: string,
    private readonly endDate?: string
  ) {}

  public calculateBalanceHistory(transactions: EthereumTransaction[]): Map<string, bigint> {
    const balances = new Map<string, bigint>()
    let cumulativeBalance = BigInt(0)

    // Trier les transactions par ordre chronologique croissant
    const sortedTransactions = [...transactions].sort(
      (a, b) => Number(a.timeStamp) - Number(b.timeStamp)
    )

    // Calculate cumulative balance for all transactions
    sortedTransactions.forEach((tx) => {
      cumulativeBalance = this.updateBalance(cumulativeBalance, tx)
      balances.set(tx.timeStamp, cumulativeBalance)
    })

    // Return full history if no date filter specified
    if (!this.startDate && !this.endDate) {
      return balances
    }

    // Filter balances by date range
    const dateRule = new DateFilterRule(this.startDate, this.endDate)
    const filteredBalances = new Map<string, bigint>()

    for (const [timestamp, balance] of balances) {
      if (dateRule.isValid({ timeStamp: timestamp } as EthereumTransaction)) {
        filteredBalances.set(timestamp, balance)
      }
    }

    return filteredBalances
  }

  public formatBalanceHistory(balances: Map<string, bigint>): BalanceHistory[] {
    return Array.from(balances.entries()).map(([timestamp, balance]) => ({
      date: formatTimestamp(timestamp),
      value: balance.toString(),
    }))
  }

  private updateBalance(currentBalance: bigint, tx: EthereumTransaction): bigint {
    const value = BigInt(tx.value)
    const gasCost = this.calculateGasCost(tx)

    if (this.isReceiver(tx)) {
      return currentBalance + value
    }

    if (this.isSender(tx)) {
      return currentBalance - value - gasCost
    }

    return currentBalance
  }

  private calculateGasCost(tx: EthereumTransaction): bigint {
    const gasPrice = BigInt(tx.gasPrice || '0')
    const gasUsed = BigInt(tx.gasUsed)
    return gasPrice * gasUsed
  }

  private isReceiver(tx: EthereumTransaction): boolean {
    return tx.to.toLowerCase() === this.address.toLowerCase()
  }

  private isSender(tx: EthereumTransaction): boolean {
    return tx.from.toLowerCase() === this.address.toLowerCase()
  }
}
