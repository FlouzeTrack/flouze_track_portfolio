import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Wallet from './wallet.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime()
  declare created_at: DateTime

  @column()
  declare quantity: number

  @column()
  declare is_error: boolean

  @column()
  declare gas_used: number

  @column()
  declare hash: string

  @belongsTo(() => Wallet)
  declare from: BelongsTo<typeof Wallet>

  @belongsTo(() => Wallet)
  declare to: BelongsTo<typeof Wallet>
}
