import env from '#start/env'
import { PriceDataType } from '../type/price_data.js'

export default class CryptoCompareService {
  private readonly apiUrl: string = env.get('CRYPTOCOMPARE_API_URL')
  private readonly apiKey: string = env.get('CRYPTOCOMPARE_API_KEY')

  public async fetchPrices(currency?: string, timestamp?: number): Promise<PriceDataType> {
    const fetchCurrency = currency || 'ETH'
    const fetchTimestamp = timestamp ? `&toTs=${timestamp}` : ''
    const url = `${this.apiUrl}?tsym=USD&limit=2000&fsym=${fetchCurrency}${fetchTimestamp}${this.apiKey}`

    console.log('Fetching prices from : ', url)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = (await response.json()) as unknown as PriceDataType

    if (!data.Data) {
      throw new Error('Invalid response structure')
    }

    return data
  }
}
