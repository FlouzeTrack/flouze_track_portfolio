import CryptoPrice from '#models/crypto_price'
import ApiCryptoCompareService from '#services/crypto_compare_service'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CryptoPriceSeeder extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const apiCryptoCompareService = new ApiCryptoCompareService()
    const currency = 'ETH'
    const uniqueKey = 'timestamp'

    let data = await apiCryptoCompareService.fetchPrices(currency)

    if (data.cryptoPrices.length > 0) {
      await CryptoPrice.updateOrCreateMany(uniqueKey, data.cryptoPrices)
    }

    let timestamp = data.timeFrom
    for (let i = 0; i < 3; i++) {
      data = await apiCryptoCompareService.fetchPrices(currency, timestamp)
      timestamp = data.timeFrom
      if (data.cryptoPrices.length > 0) {
        await CryptoPrice.updateOrCreateMany(uniqueKey, data.cryptoPrices)
      }
    }
  }
}
