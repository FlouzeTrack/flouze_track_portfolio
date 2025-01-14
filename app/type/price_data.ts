export interface PriceType {
  time: number
  high: number
  low: number
  open: number
  volumefrom: number
  volumeto: number
  close: number
  conversionType: string
  conversionSymbol: string
}
export interface PriceDataType {
  Data: {
    TimeFrom: number
    TimeTo: number
    Data: PriceType[]
  }
}
