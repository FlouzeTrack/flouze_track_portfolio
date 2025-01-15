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
  gas: string
  gasUsed: string
  gasPrice: string
  isError: string
}

export interface TokenTransaction extends EthereumTransaction {
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  contractAddress: string
}
