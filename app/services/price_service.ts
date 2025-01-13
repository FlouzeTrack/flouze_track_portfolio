import ETHPrice from '#models/eth_price'
import env from '#start/env'
import { CryptoCompareApiResponse } from '../type/price_data_type.js'
import dayjs from 'dayjs'

export default class PriceService {
  private readonly apiUrl: string = env.get('CRYPTOCOMPARE_API_URL')
  private readonly apiKey: string = env.get('CRYPTOCOMPARE_API_KEY')

  public async fetchPrices(currency?: string): Promise<void> {
    const url = `${this.apiUrl}${this.apiKey}`
    console.log('Fetching prices from : ', url)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = (await response.json()) as unknown as CryptoCompareApiResponse

    if (!data.Data) {
      throw new Error('Invalid response structure')
    }

    // Save the data to the database
    for (const price of data.Data) {
      // Format date to YYYY/MM/DD HH:MM:SS
      const formattedTimestamp = dayjs.unix(price.TIMESTAMP).toDate()
      await ETHPrice.create({
        timestamp: formattedTimestamp,
        open: price.OPEN,
        close: price.CLOSE,
        high: price.HIGH,
        low: price.LOW,
      })
    }
  }
}
