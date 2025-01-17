import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
// import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
// import Wallet from './wallet.js'
// import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare timeStamp: string

  @column()
  declare walletAddress: string

  @column()
  declare value: string

  @column()
  declare isError: string

  @column()
  declare gas: string

  @column()
  declare gasUsed: string

  @column()
  declare gasPrice: string

  @column()
  declare hash: string

  @column()
  declare from: string

  @column()
  declare to: string

  // @belongsTo(() => Wallet)
  // declare from: BelongsTo<typeof Wallet>

  // @belongsTo(() => Wallet)
  // declare to: BelongsTo<typeof Wallet>

  @beforeCreate()
  public static assignUuid(model: Transaction) {
    model.id = uuidv4()
  }
}
