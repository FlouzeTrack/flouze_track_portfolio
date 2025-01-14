import ApiCryptoCompareService from '#services/crypto_compare_service'
import CryptoPriceSeedService from '#services/crypto_price_seed_service'
import CryptoPriceService from '#services/crypto_price_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class CryptoCompareProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    const cyptoPriceService = new CryptoPriceService()
    // Appel au contrôleur une fois l'application démarré
    const cryptoPriceSeedService = new CryptoPriceSeedService(
      new ApiCryptoCompareService(),
      cyptoPriceService
    )

    try {
      // Appel à la méthode `fetchPrices` pour exécuter l'action
      console.log('Fetching prices at application startup...')
      const count = await cyptoPriceService.getCryptoPricesCount()
      if (count > 0) {
        console.error('Crypto price table already seeded !')
        return
      }
      await cryptoPriceSeedService.fetchAndSavePrices('ETH')
      console.log('Crypto price table seeded successfuly !')
    } catch (error) {
      console.error('Error during startup fetchPrices:', error)
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
