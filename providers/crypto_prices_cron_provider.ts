import cron from 'node-cron'
import type { ApplicationService } from '@adonisjs/core/types'
import CryptoPriceService from '#services/crypto_price_service'
import CryptoPriceSeedService from '#services/crypto_price_seed_service'
import ApiCryptoCompareService from '#services/crypto_compare_service'

export default class CryptoPriceCronProvider {
  private cryptoPriceService: CryptoPriceService
  private cryptoPriceSeedService: CryptoPriceSeedService
  private cronJob: cron.ScheduledTask | null = null

  constructor(protected app: ApplicationService) {
    this.cryptoPriceService = new CryptoPriceService()
    this.cryptoPriceSeedService = new CryptoPriceSeedService(
      new ApiCryptoCompareService(),
      this.cryptoPriceService
    )
  }

  async ready() {
    this.cronJob = cron.schedule(
      '0 0 * * *',
      async () => {
        await this.fetchPrices()
      },
      {
        scheduled: true,
        timezone: 'Europe/Paris',
      }
    )
  }

  private async fetchPrices() {
    try {
      console.log('Fetching currency prices...')
      const price = await this.cryptoPriceService.getLastPrice()

      if (price === null) {
        throw new Error('No prices found in the database')
      }

      await this.cryptoPriceSeedService.fetchAndSaveNewPrices('ETH', price.timestamp)

      console.log('Prices updated successfully!')
    } catch (error) {
      console.error('Error updating prices:', error)
    }
  }

  async shutdown() {
    if (this.cronJob) {
      this.cronJob.stop()
    }
  }
}
