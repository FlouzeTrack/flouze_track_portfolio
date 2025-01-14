import CryptoCompareService from '#services/crypto_compare_service'
import PriceService from '#services/price_service'
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
  async start() {
    // Appel au contrôleur une fois l'application démarré
    const cryptoCompareService = new CryptoCompareService()
    const priceService = new PriceService(cryptoCompareService)

    try {
      // Appel à la méthode `fetchPrices` pour exécuter l'action
      console.log('Fetching prices at application startup...')
      await priceService.fetchAndSavePrices('ETH')
    } catch (error) {
      console.error('Error during startup fetchPrices:', error)
    }
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
