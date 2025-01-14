import env from '#start/env'
import type { EtherscanResponse, EthereumTransaction } from '#types/etherscan'

export default class EtherscanService {
  private readonly baseUrl = 'https://api.etherscan.io/api'
  private readonly apiKey = env.get('ETHERSCAN_KEY')

  public async getTransactions(address: string): Promise<EthereumTransaction[]> {
    const response = await this.fetchData<EthereumTransaction[]>('account', 'txlist', address)
    return response.result
  }

  public async getBalance(address: string): Promise<string> {
    const response = await this.fetchData<string>('account', 'balance', address)
    return response.result
  }

  private async fetchData<T>(
    module: string,
    action: string,
    address: string
  ): Promise<EtherscanResponse<T>> {
    const url = `${this.baseUrl}?module=${module}&action=${action}&address=${address}&sort=desc&apikey=${this.apiKey}`
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
