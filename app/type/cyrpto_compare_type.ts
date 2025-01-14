export interface RawCryptoCompareData {
  Data: {
    Aggregated: boolean
    TimeFrom: number
    TimeTo: number
    Data: Array<{
      time: number
      high: number
      low: number
      open: number
      volumefrom: number
      volumeto: number
      close: number
      conversionType: string
      conversionSymbol: string
    }>
  }
}
