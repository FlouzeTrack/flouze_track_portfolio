import cron from 'node-cron'
import type { ApplicationService } from '@adonisjs/core/types'
import CryptoPriceSeedService from '#services/crypto_seed_service'
import ApiCryptoCompareService from '#services/apis/crypto_compare_api_service'
import CryptoService from '#services/crypto_service'

export default class CryptoPriceCronProvider {
  private cronJob: cron.ScheduledTask | null = null
  private cyrptoSeedService: CryptoPriceSeedService
  private apiCryptoCompareService = new ApiCryptoCompareService()
  private cyrptoService = new CryptoService()

  constructor(protected app: ApplicationService) {
    this.cyrptoSeedService = new CryptoPriceSeedService(
      this.apiCryptoCompareService,
      this.cyrptoService
    )
  }

  async ready() {
    this.cronJob = cron.schedule(
      '0 0 * * *',
      async () => {
        await this.fetchCryptoValue()
      },
      {
        scheduled: true,
        timezone: 'Europe/Paris',
      }
    )
  }

  private async fetchCryptoValue() {
    try {
      console.log('Fetching currency cryptos...')

      await this.cyrptoSeedService.fetchAndSaveNewCrypto('ETH')

      console.log('Cryptos updated successfully!')
    } catch (error) {
      console.error('Error updating crypto:', error)
    }
  }

  async shutdown() {
    if (this.cronJob) {
      this.cronJob.stop()
    }
  }
}
