import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import EtherscanService from '#services/etherscan_service'
import WalletService from '#services/wallet_service'
import { ExportService } from '#services/export_service'
import { ErrorHandlerService } from '#services/error_handler_service'
import { walletAddressValidator } from '#validators/wallet/address'

@inject()
export default class WalletController {
  private readonly exportService: ExportService
  private readonly errorHandler: ErrorHandlerService

  constructor(private etherscanService: EtherscanService) {
    this.exportService = new ExportService()
    this.errorHandler = new ErrorHandlerService()
  }

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
      this.errorHandler.handle(error, { request, response }, 'fetch wallet data')
    }
  }

  public async exportTransactions({ request, response }: HttpContext): Promise<void> {
    try {
      const payload = await walletAddressValidator.validate({
        address: request.param('address', '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'),
      })

      const format = request.qs().format?.toLowerCase() || 'csv'
      const transactions = await this.walletService.exportTransactions(payload.address)

      try {
        const exporter = this.exportService.getExporter(format)
        const result = await exporter.export(transactions, { address: payload.address })

        response.header('Content-Type', result.contentType)
        response.header('Content-Disposition', `attachment; filename="${result.filename}"`)
        return response.send(result.content)
      } catch (exportError) {
        this.errorHandler.handle(exportError, { request, response }, 'export wallet data')
      }
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'export wallet data')
    }
  }
}
