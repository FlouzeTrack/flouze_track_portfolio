export interface FormatedCryptoPriceType {
  timestamp: number
  high: number
  low: number
  open: number
  close: number
}
export interface FormattedCryptoPriceDataType {
  timeFrom: number
  timeTo: number
  cryptoPrices: FormatedCryptoPriceType[]
}
