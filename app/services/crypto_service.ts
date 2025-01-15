import Crypto from '#models/crypto'
import { FormattedCryptoDataType } from '#types/formated_cyrpto_type'

export default class CryptoService {
  public async getCryptoBySymbole(symbol: string): Promise<Crypto | null> {
    const crypto = await Crypto.query().where('symbol', symbol).first()
    return crypto
  }

  public async updateCrypto(priceData: FormattedCryptoDataType): Promise<Crypto[]> {
    const rows = Crypto.updateOrCreateMany('symbol', [priceData])
    return rows
  }
}
