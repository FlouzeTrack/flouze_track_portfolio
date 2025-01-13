export interface EtherscanResponse<T> {
  status: string
  message: string
  result: T
}

export interface EthereumTransaction {
  hash: string
  timeStamp: string
  from: string
  to: string
  value: string
  gasUsed: string
  isError: string
  blockNumber: string
}
