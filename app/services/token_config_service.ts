import { TokenType } from '#enums/token_type_enum'
import { SupportedToken } from '#types/currency'

export class TokenConfigService {
  private readonly tokens: Map<string, SupportedToken>

  constructor() {
    this.tokens = new Map([
      // Native Tokens
      [
        'ETH',
        {
          symbol: 'ETH',
          name: 'Ethereum',
          type: TokenType.NATIVE,
          decimals: 18,
          isEnabled: true,
        },
      ],
      // Stablecoins
      [
        'USDT',
        {
          symbol: 'USDT',
          name: 'Tether USD',
          type: TokenType.ERC20,
          contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          decimals: 6,
          isEnabled: true,
        },
      ],
      [
        'USDC',
        {
          symbol: 'USDC',
          name: 'USD Coin',
          type: TokenType.ERC20,
          contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          decimals: 6,
          isEnabled: true,
        },
      ],

      // Popular DeFi Tokens
      [
        'UNI',
        {
          symbol: 'UNI',
          name: 'Uniswap',
          type: TokenType.ERC20,
          contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
          decimals: 18,
          isEnabled: true,
        },
      ],
      [
        'LINK',
        {
          symbol: 'LINK',
          name: 'Chainlink',
          type: TokenType.ERC20,
          contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
          decimals: 18,
          isEnabled: true,
        },
      ],
      [
        'AAVE',
        {
          symbol: 'AAVE',
          name: 'Aave',
          type: TokenType.ERC20,
          contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
          decimals: 18,
          isEnabled: true,
        },
      ],

      // Meme Tokens
      [
        'SHIB',
        {
          symbol: 'SHIB',
          name: 'Shiba Inu',
          type: TokenType.ERC20,
          contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
          decimals: 18,
          isEnabled: true,
        },
      ],
      [
        'PEPE',
        {
          symbol: 'PEPE',
          name: 'Pepe',
          type: TokenType.ERC20,
          contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
          decimals: 18,
          isEnabled: true,
        },
      ],

      // Gaming Tokens
      [
        'SAND',
        {
          symbol: 'SAND',
          name: 'The Sandbox',
          type: TokenType.ERC20,
          contractAddress: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
          decimals: 18,
          isEnabled: true,
        },
      ],
      [
        'MANA',
        {
          symbol: 'MANA',
          name: 'Decentraland',
          type: TokenType.ERC20,
          contractAddress: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
          decimals: 18,
          isEnabled: true,
        },
      ],
    ])
  }

  public getToken(symbol: string): SupportedToken | undefined {
    return this.tokens.get(symbol.toUpperCase())
  }

  public getSupportedSymbols(): string[] {
    return Array.from(this.tokens.keys())
  }

  public getSupportedTokens(): SupportedToken[] {
    return Array.from(this.tokens.values()).filter((token) => token.isEnabled)
  }
}
