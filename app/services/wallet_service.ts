import type { EthereumTransaction } from '#types/etherscan'
import type {
  FormattedTransaction,
  WalletResponse,
  TransactionExport,
  BalanceHistory,
  WalletPriceResponse,
  WalletPriceHistory,
} from '#types/wallet'
import EtherscanService from './apis/etherscan_api_service.js'
import { BalanceCalculator } from './balance_calculator_service.js'
import { formatTimestamp } from '#utils/date'
import { DateFilterRule } from '#rules/date_filter_rules'
import CryptoPriceService from '#services/crypto_price_service'
import TransactionService from '#services/transaction_service'

export default class WalletService {
  private transactionService: TransactionService
  constructor(private etherscanService: EtherscanService) {
    this.transactionService = new TransactionService()
  }

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

  public async getWalletPrices(
    address: string,
    startDate?: string,
    endDate?: string
  ): Promise<WalletPriceResponse> {
    // Get balance history and prices
    const [{ currentBalance, history }, prices] = await Promise.all([
      this.getBalanceHistory(address, 'ETH'),
      new CryptoPriceService().getAllPrices(startDate, endDate),
    ])

    // Create a map of balances by date for quick lookup
    const balanceMap = new Map(
      history.map((item) => [
        item.date.split('T')[0], // YYYY-MM-DD
        BigInt(item.value),
      ])
    )

    // Group prices by date and calculate daily wallet values
    const dailyPrices = prices.reduce((acc: WalletPriceHistory[], price) => {
      const date = new Date(price.timestamp * 1000).toISOString()
      const dateOnly = date.split('T')[0]

      // Get the last known balance before or on this date
      let balance = balanceMap.get(dateOnly)
      if (!balance) {
        // If no balance for this date, find the most recent previous balance
        const previousDates = Array.from(balanceMap.entries())
          .filter(([d]) => d < dateOnly)
          .sort(([a], [b]) => a.localeCompare(b))

        balance = previousDates.length > 0 ? previousDates[previousDates.length - 1][1] : BigInt(0)
      }

      // Calculate USD value
      const valueUsd = ((Number(balance) / 1e18) * price.close).toFixed(2)

      acc.push({
        date,
        balance: balance.toString(),
        price: price.close,
        valueUsd,
      })

      return acc
    }, [])

    // Calculate current value
    const currentPrice = prices[prices.length - 1]?.close || 0
    const currentValueUsd = ((Number(currentBalance) / 1e18) * currentPrice).toFixed(2)

    return {
      currentBalance,
      currentValueUsd,
      history: dailyPrices,
    }
  }

  private async getTransactionsByCurrency(
    address: string,
    currency: string = 'ETH',
    startDate?: string,
    endDate?: string
  ): Promise<EthereumTransaction[]> {
    // get last transaction into ehterscanService
    const lastTransaction = await this.etherscanService.getLastTransaction(address, currency)
    // get last transaction into db
    const lastDbTransaction = await this.transactionService.getLastTransactionByAdress(address)
    // last in db not exist

    if (!lastDbTransaction || lastTransaction?.timeStamp !== lastDbTransaction?.timeStamp) {
      const allTransactions = await this.etherscanService.getTransactions(address, currency)
      for (const transaction of allTransactions) {
        await this.transactionService.createTransaction(transaction, address)
      }
    }

    const dBtransactions = await this.transactionService.getAllTransactionsByAdress(address)

    const transactions: EthereumTransaction[] = dBtransactions.map((tx) => ({
      hash: tx.hash,
      timeStamp: tx.timeStamp,
      gas: tx.gas,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      isError: tx.isError,
      from: tx.from,
      to: tx.to,
      value: tx.value,
    }))

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
