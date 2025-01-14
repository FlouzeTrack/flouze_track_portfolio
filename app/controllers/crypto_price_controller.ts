import { inject } from '@adonisjs/core'
import CryptoPriceService from '#services/crypto_price_service'

@inject()
export default class CryptoPriceController {
  private cryptoPriceService: CryptoPriceService

  constructor() {
    this.cryptoPriceService = new CryptoPriceService()
  }

  public async getPrices({ response }: any) {
    const prices = await this.cryptoPriceService.getAllPrices()
    return response.json(prices)
  }
}
