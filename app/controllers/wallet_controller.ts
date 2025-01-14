import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import type { ValidationError, ValidationErrorResponse } from '@vinejs/vine'
import EtherscanService from '#services/etherscan_service'
import WalletService from '#services/wallet_service'
import { walletAddressValidator } from '#validators/wallet/address'

@inject()
export default class WalletController {
  constructor(private etherscanService: EtherscanService) {}

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
      // Check if error is a VineJS validation error
      if (error instanceof Error && 'messages' in error) {
        const validationError = error as ValidationError
        const errorResponse: ValidationErrorResponse = {
          error: 'Validation failure',
          message: 'Invalid Ethereum address format',
          errors: validationError.messages,
        }
        return response.status(400).json(errorResponse)
      }

      return response.status(500).json({
        error: 'Failed to fetch wallet data',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
