import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Balance from './balance.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.js'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare user_id: string

  @hasMany(() => Balance)
  declare balances: HasMany<typeof Balance>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}
