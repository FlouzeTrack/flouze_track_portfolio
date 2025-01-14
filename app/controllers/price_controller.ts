import ETHPrice from '#models/eth_price'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PriceService from '#services/price_service'
import { currencyValidator } from '#validators/price/currency_validator'

@inject()
export default class PriceController {
  private priceService: PriceService

  constructor() {
    this.priceService = new PriceService()
  }

  public async getPrices({ response }: any) {
    const prices = await ETHPrice.query().orderBy('timestamp', 'desc').limit(10)
    return response.json(prices)
  }

  public async fetchPrices({ request, response }: HttpContext): Promise<any> {
    try {
      const payload = await currencyValidator.validate({
        currency: request.param('currency', 'ETH'),
      })

      const prices = await this.priceService.fetchPrices(payload.currency)

      return response.json(prices)
    } catch (error: any) {
      console.error('Error while fetching : ', error)
      return { message: 'Failed to fetch prices', error: error.message }
    }
  }
}
