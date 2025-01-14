import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CryptoPrice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare timestamp: Date // Unix timestamp representing the date

  @column()
  declare open: number // Opening price of the cryptocurrency

  @column()
  declare close: number // Closing price of the cryptocurrency

  @column()
  declare high: number // Highest price of the day

  @column()
  declare low: number // Lowest price of the day

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
