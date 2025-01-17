export interface FormattedTransaction {
  hash: string
  symbol: string
  currency: string
  value: string
  date: string
  from: string
  to: string
  isError: boolean
  gas: string
  gasUsed: string
  gasPrice: string
}

export interface WalletResponse {
  address: string
  ethBalance: string
  transactions: FormattedTransaction[]
}

export interface TransactionExport {
  hash: string
  date: string
  from: string
  to: string
  value: string
  currency: string
  gasUsed: string
  status: 'Success' | 'Failed'
}

export interface BalanceHistory {
  date: string
  value: string
}

export interface WalletPriceHistory {
  date: string
  balance: string
  price: number
  valueUsd: string
}

export interface WalletPriceResponse {
  currentBalance: string
  currentValueUsd: string
  history: WalletPriceHistory[]
}
