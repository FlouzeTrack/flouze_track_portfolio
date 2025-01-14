import CryptoCompareMapper from '#mappers/crypto_compare_mapper'
import env from '#start/env'
import { RawCryptoCompareData } from '#types/cyrpto_compare_type'
import { FormattedCryptoPriceDataType } from '#types/formated_cyrpto_price_type'

export default class ApiCryptoCompareService {
  private readonly apiUrl: string = env.get('CRYPTOCOMPARE_API_URL')
  private readonly apiKey: string = env.get('CRYPTOCOMPARE_API_KEY')

  public async fetchPrices(
    currency?: string,
    timestamp?: number
  ): Promise<FormattedCryptoPriceDataType> {
    const fetchCurrency = currency || 'ETH'
    const fetchTimestamp = timestamp ? `&toTs=${timestamp}` : ''
    const url = `${this.apiUrl}?tsym=USD&limit=2000&fsym=${fetchCurrency}${fetchTimestamp}${this.apiKey}`

    console.log('Fetching prices from : ', url)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const rawData = (await response.json()) as RawCryptoCompareData
    return CryptoCompareMapper.toCryptoPriceData(rawData)
  }
}
