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
        throw new Error('Unauthorized access')
      }
      const { startDate, endDate } = request.qs()
      if (!startDate || !endDate) {
        return response.badRequest('start and end date are required')
      }
      const prices = await this.cryptoPriceService.getAllPrices(startDate, endDate)
      return response.ok(prices)
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'fetch prices')
    }
  }

  public async getKPIs({ request, response }: HttpContext): Promise<void> {
    try {
      const { startDate, endDate } = request.qs()
      if (!startDate || !endDate) {
        return response.badRequest('start and end date are required')
      }
      const kpis = await this.cryptoPriceService.getKPIs(startDate, endDate)
      return response.ok(kpis)
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'fetch kpis')
    }
  }
}
