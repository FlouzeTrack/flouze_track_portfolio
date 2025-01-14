import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import CryptoPriceService from '#services/crypto_price_service'
import CryptoPriceSeedService from '#services/crypto_price_seed_service'
import ApiCryptoCompareService from '#services/crypto_compare_service'

@inject()
export default class CryptoPriceSeedController {
  private cryptoPriceSeedService: CryptoPriceSeedService

  constructor() {
    this.cryptoPriceSeedService = new CryptoPriceSeedService(
      new ApiCryptoCompareService(),
      new CryptoPriceService()
    )
  }

  public async seedCryptoPrice({ request, response }: HttpContext): Promise<any> {
    try {
      const currency = request.param('currency', 'ETH')
      const prices = await this.cryptoPriceSeedService.fetchAndSaveOldPrices(currency)
      return response.json(prices)
    } catch (error: any) {
      console.error('Error while fetching:', error)
      return response.status(500).json({ message: 'Failed to fetch prices', error: error.message })
    }
  }
}
