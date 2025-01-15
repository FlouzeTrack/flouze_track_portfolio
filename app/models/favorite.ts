import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Wallet from './wallet.js'
import { v4 as uuidv4 } from 'uuid'

export default class Favorite extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare quantity: number

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  @column()
  declare user_id: string

  @beforeCreate()
  public static assignUuid(model: Favorite) {
    model.id = uuidv4() // Génère un UUID avant l'insertion
  }
}
