import type { EthereumTransaction } from '#types/etherscan'
import type { BalanceHistory } from '#types/wallet'
import { formatTimestamp } from '#utils/date'

export class BalanceCalculator {
  constructor(private readonly address: string) {}

  public calculateBalanceHistory(transactions: EthereumTransaction[]): Map<string, bigint> {
    const balances = new Map<string, bigint>()
    let cumulativeBalance = BigInt(0)

    transactions.forEach((tx) => {
      const timestamp = tx.timeStamp
      cumulativeBalance = this.updateBalance(cumulativeBalance, tx)
      balances.set(timestamp, cumulativeBalance)
    })

    return balances
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
