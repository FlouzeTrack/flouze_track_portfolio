import CryptoPrice from '#models/crypto_price'
import { FormatedCryptoPriceType } from '#types/formated_cyrpto_price_type'
import db from '@adonisjs/lucid/services/db'

export default class CryptoPriceService {
  public async getAllPrices(startDate?: string, endDate?: string): Promise<CryptoPrice[]> {
    const query = CryptoPrice.query().orderBy('timestamp', 'asc')

    if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
      query.where('timestamp', '>=', startTimestamp)
    }

    if (endDate) {
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
      query.where('timestamp', '<=', endTimestamp)
    }

    return await query
  }

  public async getKPIs(
    startDate?: string,
    endDate?: string
  ): Promise<{
    currentPrice: number
    priceChange: number
    highestPeriodPrice: number
    highestPeriodPriceTimestamp: number
    lowestPeriodPrice: number
    lowestPeriodPriceTimestamp: number
  }> {
    const currentPrice = await this.getLastPrice()
    const priceChange = await this.getPriceChange()
    const lowestPeriodPriceQuery = CryptoPrice.query().orderBy('low', 'asc')
    const highestPeriodPriceQuery = CryptoPrice.query().orderBy('high', 'desc')

    if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
      lowestPeriodPriceQuery.where('timestamp', '>=', startTimestamp)
      highestPeriodPriceQuery.where('timestamp', '>=', startTimestamp)
    }

    if (endDate) {
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
      lowestPeriodPriceQuery.where('timestamp', '<=', endTimestamp)
      highestPeriodPriceQuery.where('timestamp', '<=', endTimestamp)
    }

    const lowestPeriodPrice = await lowestPeriodPriceQuery.first()
    const highestPeriodPrice = await highestPeriodPriceQuery.first()

    return {
      currentPrice: currentPrice?.close || 0,
      priceChange: priceChange || 0,
      highestPeriodPrice: highestPeriodPrice?.high || 0,
      highestPeriodPriceTimestamp: highestPeriodPrice?.timestamp || 0,
      lowestPeriodPrice: lowestPeriodPrice?.low || 0,
      lowestPeriodPriceTimestamp: lowestPeriodPrice?.timestamp || 0,
    }
  }

  public async getPriceChange(startDate?: string, endDate?: string): Promise<number | null> {
    // Fetch the latest price and the previous price
    const query = CryptoPrice.query().orderBy('timestamp', 'desc').limit(2)

    if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
      query.where('timestamp', '>=', startTimestamp)
    }

    if (endDate) {
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
      query.where('timestamp', '<=', endTimestamp)
    }

    const prices = await query.limit(2)

    if (prices.length < 2) {
      // Not enough data to calculate price change
      return null
    }

    const latestPrice = prices[0].close
    const previousPrice = prices[1].close

    // Calculate the price change percentage
    const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100
    return priceChange
  }

  public async getPriceByTimeStamp(timeStamp: number): Promise<CryptoPrice | null> {
    const price = await CryptoPrice.query().where('timestamp', timeStamp).first()
    return price
  }

  public async getLastPrice(startDate?: string, endDate?: string): Promise<CryptoPrice | null> {
    const query = CryptoPrice.query().orderBy('timestamp', 'desc')

    if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
      query.where('timestamp', '>=', startTimestamp)
    }

    if (endDate) {
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)
      query.where('timestamp', '<=', endTimestamp)
    }

    const price = await query.first()
    return price
  }

  public async getCryptoPricesCount(): Promise<number> {
    const raws = await db.rawQuery('SELECT COUNT(*) AS count FROM crypto_prices;')
    const { count } = raws[0][0]
    return count
  }

  public async createCryptoPrice(priceData: FormatedCryptoPriceType): Promise<CryptoPrice[]> {
    const rows = db.table('crypto_prices').returning('id').insert({
      timestamp: priceData.timestamp,
      high: priceData.high,
      low: priceData.low,
      open: priceData.open,
      close: priceData.close,
    })
    return rows
  }

  public async createMultipleCryptoPrices(
    pricesData: FormatedCryptoPriceType[]
  ): Promise<CryptoPrice[]> {
    const rows = db.table('crypto_prices').multiInsert(pricesData)
    return rows
  }
}
