export interface FormattedTransaction {
  hash: string
  symbol: 'ETH'
  currency: 'ETH'
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
