import ApiCryptoCompareService from './apis/crypto_compare_api_service.js'
import CryptoService from './crypto_service.js'

export default class CryptoPriceSeedService {
  constructor(
    private cryptoCompareService: ApiCryptoCompareService,
    private cryptoService: CryptoService
  ) {}

  public async fetchAndSaveNewCrypto(currency: string = 'ETH'): Promise<void> {
    let data = await this.cryptoCompareService.fetchCryptoLastValue(currency)

    if (data) {
      await this.cryptoService.updateCrypto(data)
    }
  }
}
