import CryptoPrice from '#models/crypto_price'
import { FormatedCryptoPriceType } from '#types/formated_cyrpto_price_type'
import db from '@adonisjs/lucid/services/db'

export default class CryptoPriceService {
  public async getAllPrices(): Promise<CryptoPrice[]> {
    const prices = await CryptoPrice.query().orderBy('timestamp', 'desc')
    return prices
  }

  public async getPriceByTimeStamp(timeStamp: number): Promise<CryptoPrice | null> {
    const price = await CryptoPrice.query().where('timestamp', timeStamp).first()
    return price
  }

  public async getLastPrice(): Promise<CryptoPrice | null> {
    const price = await CryptoPrice.query().orderBy('timestamp', 'desc').first()
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
