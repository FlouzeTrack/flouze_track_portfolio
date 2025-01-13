import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { errors } from '@vinejs/vine'
import EtherscanService from '#services/etherscan_service'
import WalletService from '#services/wallet_service'
import { walletAddressValidator } from '#validators/wallet/address'

export default class WalletController {
  constructor(@inject() private etherscanService: EtherscanService) {}

  private get walletService(): WalletService {
    return new WalletService(this.etherscanService)
  }

  public async getTransactions({ request, response }: HttpContext): Promise<void> {
    try {
      const payload = await walletAddressValidator.validate({
        address: request.param('address', '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'),
      })

      const walletInfo = await this.walletService.getWalletInfo(payload.address)
      return response.json(walletInfo)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(400).json({
          error: 'Validation failure',
          message: 'Invalid Ethereum address format',
        })
      }

      return response.status(500).json({
        error: 'Failed to fetch wallet data',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
