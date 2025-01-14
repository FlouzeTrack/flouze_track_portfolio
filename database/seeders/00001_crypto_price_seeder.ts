import CryptoPrice from '#models/crypto_price'
import ApiCryptoCompareService from '#services/apis/crypto_compare_api_service'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CryptoPriceSeeder extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const apiCryptoCompareService = new ApiCryptoCompareService()
    const currency = 'ETH'
    const uniqueKey = 'timestamp'

    // Check if there is any data in the table
    const test = await CryptoPrice.query().select('id').first()

    if (test) {
      console.log('Data already exists in crypto_prices table')
      return
    }

    // Fetch and save old prices
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
