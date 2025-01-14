import { RawCryptoCompareData } from '#types/cyrpto_compare_type'
import { FormattedCryptoPriceDataType } from '#types/formated_cyrpto_price_type'

export default class CryptoCompareMapper {
  public static toCryptoPriceData(data: RawCryptoCompareData): FormattedCryptoPriceDataType {
    if (!data.Data?.Data) {
      throw new Error('Invalid data structure')
    }
    const formattedData: FormattedCryptoPriceDataType = {
      timeFrom: data.Data.TimeFrom,
      timeTo: data.Data.TimeTo,
      cryptoPrices: data.Data.Data.map((item) => ({
        timestamp: item.time,
        high: item.high,
        low: item.low,
        open: item.open,
        close: item.close,
      })),
    }

    return formattedData
  }
}
