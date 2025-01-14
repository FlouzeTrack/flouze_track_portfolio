import CryptoCompareService from './apis/crypto_compare_api_service.js'
import CryptoPriceService from './crypto_price_service.js'

export default class CryptoPriceSeedService {
  constructor(
    private cryptoCompareService: CryptoCompareService,
    private cryptoPriceService: CryptoPriceService
  ) {}

  public async fetchAndSaveOldPrices(currency: string = 'ETH'): Promise<void> {
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

  public async fetchAndSaveNewPrices(currency: string = 'ETH', timeStamp: number): Promise<void> {
    let data = await this.cryptoCompareService.fetchPrices(currency, timeStamp)
    let isFromPriceExistInDb = await this.cryptoPriceService.getPriceByTimeStamp(data.timeFrom)

    while (true) {
      if (!isFromPriceExistInDb) {
        await this.cryptoPriceService.createMultipleCryptoPrices(data.cryptoPrices)
      } else {
        for (const price of data.cryptoPrices) {
          let isPriceExistInDb = await this.cryptoPriceService.getPriceByTimeStamp(price.timestamp)
          if (isPriceExistInDb) {
            return
          }
          await this.cryptoPriceService.createCryptoPrice(price)
        }
      }
      data = await this.cryptoCompareService.fetchPrices(currency, data.timeFrom)
      isFromPriceExistInDb = await this.cryptoPriceService.getPriceByTimeStamp(data.timeFrom)
    }
  }
}
