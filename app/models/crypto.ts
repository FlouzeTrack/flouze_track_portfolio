import { BaseModel, column } from '@adonisjs/lucid/orm'
// import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
// import Balance from './balance.js'
// import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Crypto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @column()
  declare symbol: string

  @column()
  declare name: string

  @column()
  declare value: number

  // @hasMany(() => Balance)
  // declare balances: HasMany<typeof Balance>
}
