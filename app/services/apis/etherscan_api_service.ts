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
    address: string
  ): Promise<(EthereumTransaction | TokenTransaction)[]> {
    const transactions = await Promise.all([
      this.getEthTransactions(address),
      ...this.getSupportedTokenTransactions(address),
    ])

    return transactions
      .flat()
      .sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))
      .slice(0)
  }

  public async getBalance(address: string): Promise<string> {
    const response = await this.fetchData<string>('account', 'balance', address)
    return response.result
  }

  private async getEthTransactions(address: string): Promise<EthereumTransaction[]> {
    try {
      // Get normal transactions
      const normalTxs = await this.fetchData<EthereumTransaction[]>('account', 'txlist', address, {
        offset: '10000',
      })

      // Get internal transactions
      let internalTxs: EtherscanResponse<EthereumTransaction[]> = {
        status: '1',
        message: 'OK',
        result: [],
      }

      try {
        internalTxs = await this.fetchData<EthereumTransaction[]>(
          'account',
          'txlistinternal',
          address,
          {
            offset: '10000',
          }
        )
      } catch (error) {
        // Ignore internal tx errors
      }

      // Return empty array if no transactions
      if (!normalTxs.result?.length && !internalTxs.result?.length) {
        return []
      }

      // Combine and sort all transactions
      return [...(normalTxs.result || []), ...(internalTxs.result || [])].sort(
        (a, b) => Number(b.timeStamp) - Number(a.timeStamp)
      )
    } catch (error) {
      throw new Error('Failed to fetch transactions')
    }
  }

  private async getTokenTransactions(
    address: string,
    contractAddress: string
  ): Promise<EthereumTransaction[]> {
    const response = await this.fetchData<EthereumTransaction[]>('account', 'tokentx', address, {
      contractaddress: contractAddress,
      offset: '10000',
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

  public async getLastTransaction(
    address: string,
    currency: string = 'ETH'
  ): Promise<EthereumTransaction | TokenTransaction | null> {
    const token = this.tokenConfig.getToken(currency)
    if (!token?.isEnabled) {
      throw new Error(`Unsupported currency: ${currency}`)
    }

    // Si la devise est ETH, récupérer la dernière transaction ETH, sinon pour les tokens
    if (token.type === TokenType.NATIVE) {
      return this.getLastEthTransaction(address)
    } else {
      return this.getLastTokenTransaction(address, token.contractAddress!)
    }
  }

  private async getLastEthTransaction(address: string): Promise<EthereumTransaction | null> {
    try {
      // Récupérer uniquement la dernière transaction (avec un offset de 1 pour n'obtenir qu'une seule transaction)
      const response = await this.fetchData<EthereumTransaction[]>('account', 'txlist', address, {
        offset: '1',
      })

      // Si aucune transaction n'est trouvée, retourner null
      if (!response.result?.length) {
        return null
      }

      // Retourner la dernière transaction (la plus récente)
      return response.result[0]
    } catch (error) {
      throw new Error('Failed to fetch last ETH transaction')
    }
  }

  private async getLastTokenTransaction(
    address: string,
    contractAddress: string
  ): Promise<EthereumTransaction | null> {
    try {
      // Récupérer uniquement la dernière transaction pour le token (avec un offset de 1)
      const response = await this.fetchData<EthereumTransaction[]>('account', 'tokentx', address, {
        contractaddress: contractAddress,
        offset: '1',
      })

      // Si aucune transaction n'est trouvée, retourner null
      if (!response.result?.length) {
        return null
      }

      // Retourner la dernière transaction (la plus récente)
      return response.result[0]
    } catch (error) {
      throw new Error('Failed to fetch last token transaction')
    }
  }
}
