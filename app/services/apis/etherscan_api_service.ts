import env from '#start/env'
import type { EtherscanResponse, EthereumTransaction, TokenTransaction } from '#types/etherscan'
import { TokenConfigService } from '#services/token_config_service'
import { SupportedToken } from '#types/currency'
import { TokenType } from '#enums/token_type_enum'

export default class EtherscanService {
  private readonly baseUrl = 'https://api.etherscan.io/api'
  private readonly apiKey = env.get('ETHERSCAN_KEY')
  private readonly tokenConfig: TokenConfigService

  constructor() {
    this.tokenConfig = new TokenConfigService()
  }

  public async getTransactions(
    address: string,
    currency: string = 'ETH'
  ): Promise<EthereumTransaction[]> {
    const token = this.tokenConfig.getToken(currency)
    if (!token?.isEnabled) {
      throw new Error(`Unsupported currency: ${currency}`)
    }

    return token.type === TokenType.NATIVE
      ? this.getEthTransactions(address)
      : this.getTokenTransactions(address, token.contractAddress!)
  }

  public async getAllTransactions(
    address: string,
    limit: number = 10
  ): Promise<(EthereumTransaction | TokenTransaction)[]> {
    const transactions = await Promise.all([
      this.getEthTransactions(address),
      ...this.getSupportedTokenTransactions(address),
    ])

    return transactions
      .flat()
      .sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))
      .slice(0, limit)
  }

  public async getBalance(address: string): Promise<string> {
    const response = await this.fetchData<string>('account', 'balance', address)
    return response.result
  }

  private async getEthTransactions(address: string): Promise<EthereumTransaction[]> {
    const response = await this.fetchData<EthereumTransaction[]>('account', 'txlist', address)
    return response.result
  }

  private async getTokenTransactions(
    address: string,
    contractAddress: string
  ): Promise<EthereumTransaction[]> {
    const response = await this.fetchData<EthereumTransaction[]>('account', 'tokentx', address, {
      contractaddress: contractAddress,
    })
    return response.result
  }

  private getSupportedTokenTransactions(address: string): Promise<EthereumTransaction[]>[] {
    return this.tokenConfig
      .getSupportedTokens()
      .filter((token: SupportedToken) => token.type !== TokenType.NATIVE && token.contractAddress)
      .map((token: SupportedToken) => this.getTokenTransactions(address, token.contractAddress!))
  }

  private async fetchData<T>(
    module: string,
    action: string,
    address: string,
    params: Record<string, string> = {}
  ): Promise<EtherscanResponse<T>> {
    const queryParams = new URLSearchParams({
      module,
      action,
      address,
      sort: 'desc',
      apikey: this.apiKey,
      ...params,
    })

    const url = `${this.baseUrl}?${queryParams.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as EtherscanResponse<T>
    if (!data || data.status !== '1') {
      throw new Error(data.message || 'Failed to fetch data from Etherscan')
    }

    return data
  }
}
