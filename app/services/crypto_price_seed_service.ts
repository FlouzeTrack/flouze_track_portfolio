import CryptoCompareService from './crypto_compare_service.js'
import CryptoPriceService from './crypto_price_service.js'

export default class CryptoPriceSeedService {
  constructor(
    private cryptoCompareService: CryptoCompareService,
    private cryptoPriceService: CryptoPriceService
  ) {}

  public async fetchAndSavePrices(currency: string = 'ETH'): Promise<void> {
    let data = await this.cryptoCompareService.fetchPrices(currency)
    let isPricesExistInDb = await this.cryptoPriceService.getPriceByTimeStamp(data.timeFrom)
    let isCreatable = data.cryptoPrices.length > 0 && !isPricesExistInDb

    if (isCreatable) {
      await this.cryptoPriceService.createMultipleCryptoPrices(data.cryptoPrices)
    }

    let timestamp = data.timeFrom
    for (let i = 0; i < 3; i++) {
      data = await this.cryptoCompareService.fetchPrices(currency, timestamp)
      if (isCreatable) {
        await this.cryptoPriceService.createMultipleCryptoPrices(data.cryptoPrices)
      }
    }
  }
}
