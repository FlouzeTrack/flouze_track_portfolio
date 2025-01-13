export interface ApiResponse {
  Data: PriceDataType[]
}

export interface PriceDataType {
  UNIT: string
  TIMESTAMP: number
  TYPE: string
  MARKET: string
  INSTRUMENT: string
  OPEN: number
  HIGH: number
  LOW: number
  CLOSE: number
  FIRST_MESSAGE_TIMESTAMP: number
  LAST_MESSAGE_TIMESTAMP: number
  FIRST_MESSAGE_VALUE: number
  HIGH_MESSAGE_VALUE: number
  HIGH_MESSAGE_TIMESTAMP: number
  LOW_MESSAGE_VALUE: number
  LOW_MESSAGE_TIMESTAMP: number
  LAST_MESSAGE_VALUE: number
  TOTAL_INDEX_UPDATES: number
  VOLUME: number
  QUOTE_VOLUME: number
  VOLUME_TOP_TIER: number
  QUOTE_VOLUME_TOP_TIER: number
  VOLUME_DIRECT: number
  QUOTE_VOLUME_DIRECT: number
  VOLUME_TOP_TIER_DIRECT: number
  QUOTE_VOLUME_TOP_TIER_DIRECT: number
}
