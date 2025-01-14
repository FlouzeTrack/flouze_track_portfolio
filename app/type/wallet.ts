export interface FormattedTransaction {
  hash: string
  symbol: string
  currency: string
  value: string
  date: string
  from: string
  to: string
  isError: boolean
  gasUsed: string
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
