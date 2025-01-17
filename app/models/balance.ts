import { BaseModel, column } from '@adonisjs/lucid/orm'
// import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
// import type { BelongsTo } from '@adonisjs/lucid/types/relations'
// import Wallet from './wallet.js'
// import Crypto from './crypto.js'
import { DateTime } from 'luxon'

export default class Balance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare wallet_address: string

  @column()
  declare currency: string

  @column()
  declare data: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
