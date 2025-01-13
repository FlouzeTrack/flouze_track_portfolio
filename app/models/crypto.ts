import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Balance from './balance.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Crypto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare symbol: string

  @column()
  declare name: string

  @column()
  declare value: number

  @hasMany(() => Balance)
  declare balances: HasMany<typeof Balance>
}
