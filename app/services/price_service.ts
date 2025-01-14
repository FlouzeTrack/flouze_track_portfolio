import CryptoPrice from '#models/crypto_price'
import { PriceType } from '../type/price_data.js'
import dayjs from 'dayjs'

export default class PriceService {
  public async savePricesInDb(prices: PriceType[]): Promise<void> {
    // Save the data to the database
    for (const price of prices) {
      // Format date to YYYY/MM/DD HH:MM:SS
      const formattedTimestamp = dayjs.unix(price.time).toDate()

      await CryptoPrice.create({
        timestamp: formattedTimestamp,
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
