import type { EthereumTransaction } from '#types/etherscan'
import type {
  FormattedTransaction,
  WalletResponse,
  TransactionExport,
  BalanceHistory,
} from '#types/wallet'
import EtherscanService from './apis/etherscan_api_service.js'
import { BalanceCalculator } from './balance_calculator_service.js'
import { formatTimestamp } from '#utils/date'
import { DateFilterRule } from '#rules/date_filter_rules'

export default class WalletService {
  constructor(private etherscanService: EtherscanService) {}

  public async getWalletInfo(
    address: string,
    currency?: string,
    startDate?: string,
    endDate?: string
  ): Promise<WalletResponse> {
    const [transactions, balance] = await Promise.all([
      this.getTransactionsByCurrency(address, currency, startDate, endDate),
      this.etherscanService.getBalance(address),
    ])

    return {
      address,
      ethBalance: this.formatBalance(balance),
      transactions: this.formatTransactions(transactions, currency),
    }
  }

  public async getBalanceHistory(
    address: string,
    currency: string = 'ETH',
    startDate?: string,
    endDate?: string
  ): Promise<{
    currentBalance: string
    history: BalanceHistory[]
  }> {
    const [transactions, currentBalance] = await Promise.all([
      this.getTransactionsByCurrency(address, currency),
      this.etherscanService.getBalance(address),
    ])

    const calculator = new BalanceCalculator(address, startDate, endDate)
    const balances = calculator.calculateBalanceHistory(transactions)
    const history = calculator.formatBalanceHistory(balances)

    return {
      currentBalance,
      history,
    }
  }

  private async getTransactionsByCurrency(
    address: string,
    currency: string = 'ETH',
    startDate?: string,
    endDate?: string
  ): Promise<EthereumTransaction[]> {
    const transactions = await this.etherscanService.getTransactions(address, currency)

    if (!startDate && !endDate) {
      return transactions
    }

    const dateRule = new DateFilterRule(startDate, endDate)
    return transactions.filter((tx) => dateRule.isValid(tx))
  }

  public async exportTransactions(
    address: string,
    currency: string = 'ETH'
  ): Promise<TransactionExport[]> {
    const transactions = await this.getTransactionsByCurrency(address, currency)
    return transactions.map((tx) => ({
      hash: tx.hash,
      date: formatTimestamp(tx.timeStamp),
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
    return transactions.map((tx) => ({
      hash: tx.hash,
      symbol: currency.toUpperCase(),
      currency: currency.toUpperCase(),
      value: this.formatEtherValue(tx.value),
      date: formatTimestamp(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      isError: tx.isError === '1',
      gas: tx.gas,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
    }))
  }

  private formatBalance(balanceWei: string): string {
    return (Number(balanceWei) / 1e18).toFixed(4)
  }

  private formatEtherValue(valueWei: string): string {
    return (Number(valueWei) / 1e18).toFixed(6)
  }
}
