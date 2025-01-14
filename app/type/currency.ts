import { TokenType } from '#enums/token_type_enum'

export interface TokenConfig {
  symbol: string
  name: string
  type: TokenType
  contractAddress?: string
  decimals: number
}

export interface SupportedToken extends TokenConfig {
  isEnabled: boolean
}
