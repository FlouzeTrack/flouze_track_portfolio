import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Wallet from './wallet.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column.dateTime()
  declare date: DateTime

  @column()
  declare value: string

  @column()
  declare is_error: boolean

  @column()
  declare gas_used: string

  @column()
  declare hash: string

  @belongsTo(() => Wallet)
  declare from: BelongsTo<typeof Wallet>

  @belongsTo(() => Wallet)
  declare to: BelongsTo<typeof Wallet>

  @beforeCreate()
  public static assignUuid(model: Transaction) {
    model.id = uuidv4()
  }
}
