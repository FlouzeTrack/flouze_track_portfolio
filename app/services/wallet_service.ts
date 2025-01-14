import type { EthereumTransaction } from '#types/etherscan'
import type { FormattedTransaction, WalletResponse, TransactionExport } from '#types/wallet'
import EtherscanService from './etherscan_service.js'

export default class WalletService {
  constructor(private etherscanService: EtherscanService) {}

  public async getWalletInfo(address: string, currency?: string): Promise<WalletResponse> {
    const [transactions, balance] = await Promise.all([
      this.getTransactionsByCurrency(address, currency),
      this.etherscanService.getBalance(address),
    ])

    return {
      address,
      ethBalance: this.formatBalance(balance),
      transactions: this.formatTransactions(transactions, currency),
    }
  }

  private async getTransactionsByCurrency(
    address: string,
    currency: string = 'ETH'
  ): Promise<EthereumTransaction[]> {
    return this.etherscanService.getTransactions(address, currency)
  }

  public async exportTransactions(
    address: string,
    currency: string = 'ETH'
  ): Promise<TransactionExport[]> {
    const transactions = await this.getTransactionsByCurrency(address, currency)
    return transactions.slice(0, 10).map((tx) => ({
      hash: tx.hash,
      date: this.formatTimestamp(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      value: this.formatEtherValue(tx.value),
      currency: currency.toUpperCase(),
      gasUsed: tx.gasUsed,
      status: tx.isError === '1' ? 'Failed' : 'Success',
    }))
  }

  private formatTransactions(
    transactions: EthereumTransaction[],
    currency: string = 'ETH'
  ): FormattedTransaction[] {
    return transactions.slice(0, 10).map((tx) => ({
      hash: tx.hash,
      symbol: currency.toUpperCase(),
      currency: currency.toUpperCase(),
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
