import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PriceService from '#services/price_service'
import CryptoCompareService from '#services/crypto_compare_service'
import { currencyValidator } from '#validators/price/currency_validator'

@inject()
export default class PriceController {
  private priceService: PriceService
  private cryptoCompareService: CryptoCompareService

  constructor() {
    this.priceService = new PriceService()
    this.cryptoCompareService = new CryptoCompareService()
  }

  public async fetchPrices({ request, response }: HttpContext): Promise<any> {
    try {
      const payload = { currency: request.param('currency', 'ETH') }

      let prices = await this.cryptoCompareService.fetchPrices(payload.currency)
      let pricesTotal = prices.Data.Data.length
      if (prices.Data.Data.length > 0) {
        await this.priceService.savePricesInDb(prices.Data.Data)
      }

      let timestamp = prices.Data.TimeFrom
      for (let i = 0; i < 2; i++) {
        prices = await this.cryptoCompareService.fetchPrices(payload.currency, timestamp)
        pricesTotal += prices.Data.Data.length
        if (prices.Data.Data.length > 0) {
          await this.priceService.savePricesInDb(prices.Data.Data)
        }
      }

      return response.json(prices)
    } catch (error: any) {
      console.error('Error while fetching : ', error)
      return { message: 'Failed to fetch prices', error: error.message }
    }
  }

  public async getPrices({ response }: any) {
    const prices = await this.priceService.getPricesFromDb()
    return response.json(prices)
  }
}
