import CryptoPrice from '#models/crypto_price'
import { PriceType } from '../type/price_data.js'
import dayjs from 'dayjs'
import CryptoCompareService from './crypto_compare_service.js'

export default class PriceService {
  constructor(private cryptoCompareService: CryptoCompareService) {}

  public async fetchAndSavePrices(currency: string = 'ETH'): Promise<any> {
    let prices = await this.cryptoCompareService.fetchPrices(currency)
    if (prices.Data.Data.length > 0) {
      await this.savePricesInDb(prices.Data.Data)
    }

    let timestamp = prices.Data.TimeFrom
    for (let i = 0; i < 3; i++) {
      prices = await this.cryptoCompareService.fetchPrices(currency, timestamp)
      if (prices.Data.Data.length > 0) {
        await this.savePricesInDb(prices.Data.Data)
      }
    }

    return prices
  }

  public async savePricesInDb(prices: PriceType[]): Promise<void> {
    // Save the data to the database
    for (const price of prices) {
      // Format date to YYYY/MM/DD HH:MM:SS
      // const formattedTimestamp = dayjs.unix(price.time).toDate()

      await CryptoPrice.create({
        timestamp: price.time,
        open: price.open,
        close: price.close,
        high: price.high,
        low: price.low,
      })
    }
  }

  public async getPricesFromDb(): Promise<CryptoPrice[]> {
    const prices = await CryptoPrice.query().orderBy('timestamp', 'desc').limit(10)
    return prices
  }
}
