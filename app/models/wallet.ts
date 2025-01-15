import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import Balance from './balance.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column()
  declare adress: string

  @hasMany(() => Balance)
  declare balances: HasMany<typeof Balance>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @beforeCreate()
  public static assignUuid(model: Wallet) {
    model.id = uuidv4() // Génère un UUID avant l'insertion
  }
}
