import type { EthereumTransaction } from '#types/etherscan'

interface DailyBalance {
  timestamp: number
  ethValue: string
}

export class BalanceCalculator {
  constructor(private readonly address: string) {}

  public calculateDailyBalances(transactions: EthereumTransaction[]): Map<string, bigint> {
    const dailyBalances = new Map<string, bigint>()
    let cumulativeBalance = BigInt(0)

    // Trier par timestamp croissant
    const sortedTransactions = this.sortTransactionsByTimestamp(transactions)

    sortedTransactions.forEach((tx) => {
      const date = this.formatDate(tx.timeStamp)
      cumulativeBalance = this.updateBalance(cumulativeBalance, tx)
      dailyBalances.set(date, cumulativeBalance)
    })

    return dailyBalances
  }

  public formatDailyBalances(dailyBalances: Map<string, bigint>): DailyBalance[] {
    return Array.from(dailyBalances.entries()).map(([timestamp, balance]) => ({
      timestamp: new Date(timestamp).getTime() / 1000,
      ethValue: balance.toString(),
    }))
  }

  private sortTransactionsByTimestamp(transactions: EthereumTransaction[]): EthereumTransaction[] {
    return [...transactions].sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp))
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

  private formatDate(timestamp: string): string {
    return new Date(Number(timestamp) * 1000).toISOString().split('T')[0]
  }
}
