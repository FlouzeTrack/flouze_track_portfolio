import { inject } from '@adonisjs/core'
import CryptoPriceService from '#services/crypto_price_service'
import { HttpContext } from '@adonisjs/core/http'
import { ErrorHandlerService } from '#services/error_handler_service'

@inject()
export default class CryptoPriceController {
  private cryptoPriceService: CryptoPriceService
  private readonly errorHandler: ErrorHandlerService

  constructor() {
    this.cryptoPriceService = new CryptoPriceService()
    this.errorHandler = new ErrorHandlerService()
  }

  public async getPrices({ request, response, auth }: HttpContext): Promise<void> {
    try {
      const isAuth = await auth.check()
      if (!isAuth) {
        return response.unauthorized('You must be authenticated to access this route')
      }
      const { startDate, endDate } = request.qs()
      if (!startDate || !endDate) {
        return response.badRequest('start and end date are required')
      }
      const prices = await this.cryptoPriceService.getAllPrices(startDate, endDate)
      return response.ok(prices)
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'fetch wallet data')
    }
  }
}
