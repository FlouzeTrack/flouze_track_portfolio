export enum TokenType {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  STABLECOIN = 'STABLECOIN',
  MEME = 'MEME',
}

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
