import Crypto from '#models/crypto'
import ApiCryptoCompareService from '#services/apis/crypto_compare_api_service'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CryptoSeeder extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const apiCryptoCompareService = new ApiCryptoCompareService()
    const currency = 'ETH'
    const uniqueKey = 'symbol'

    // Fetch and save old prices
    let data = await apiCryptoCompareService.fetchCryptoLastValue(currency)

    if (data) {
      await Crypto.updateOrCreateMany(uniqueKey, [data])
    }
  }
}
