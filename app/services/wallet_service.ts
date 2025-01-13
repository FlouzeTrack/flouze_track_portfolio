import type { EthereumTransaction } from '#types/etherscan'
import type { FormattedTransaction, WalletResponse } from '#types/wallet'
import EtherscanService from './etherscan_service.js'

export default class WalletService {
  constructor(private etherscanService: EtherscanService) {}

  public async getWalletInfo(address: string): Promise<WalletResponse> {
    const [transactions, balance] = await Promise.all([
      this.etherscanService.getTransactions(address),
      this.etherscanService.getBalance(address),
    ])

    return {
      address,
      ethBalance: this.formatBalance(balance),
      transactions: this.formatTransactions(transactions),
    }
  }

  private formatTransactions(transactions: EthereumTransaction[]): FormattedTransaction[] {
    return transactions.slice(0, 10).map((tx) => ({
      hash: tx.hash,
      symbol: 'ETH',
      currency: 'ETH',
      value: this.formatEtherValue(tx.value),
      date: this.formatTimestamp(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      isError: tx.isError === '1',
      gasUsed: tx.gasUsed,
    }))
  }

  private formatBalance(balanceWei: string): string {
    return (Number(balanceWei) / 1e18).toFixed(4)
  }

  private formatEtherValue(valueWei: string): string {
    return (Number(valueWei) / 1e18).toFixed(6)
  }

  private formatTimestamp(timestamp: string): string {
    return new Date(Number(timestamp) * 1000).toISOString().split('T')[0]
  }
}
