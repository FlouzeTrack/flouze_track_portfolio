import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CryptoPrice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare timestamp: number // Unix timestamp representing the date

  @column()
  declare high: number // Highest price of the day

  @column()
  declare low: number // Lowest price of the day

  @column()
  declare open: number // Opening price of the cryptocurrency

  @column()
  declare close: number // Closing price of the cryptocurrency
}
