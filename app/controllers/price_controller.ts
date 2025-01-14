import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PriceService from '#services/price_service'
import CryptoCompareService from '#services/crypto_compare_service'

@inject()
export default class PriceController {
  private priceService: PriceService

  constructor() {
    const cryptoCompareService = new CryptoCompareService()
    this.priceService = new PriceService(cryptoCompareService)
  }

  public async fetchPrices({ request, response }: HttpContext): Promise<any> {
    try {
      const currency = request.param('currency', 'ETH')
      const prices = await this.priceService.fetchAndSavePrices(currency)
      return response.json(prices)
    } catch (error: any) {
      console.error('Error while fetching:', error)
      return response.status(500).json({ message: 'Failed to fetch prices', error: error.message })
    }
  }

  public async getPrices({ response }: any) {
    const prices = await this.priceService.getPricesFromDb()
    return response.json(prices)
  }
}
