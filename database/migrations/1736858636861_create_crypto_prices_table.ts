import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crypto_prices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('timestamp').notNullable()
      table.decimal('high', 20, 8).notNullable()
      table.decimal('low', 20, 8).notNullable()
      table.decimal('open', 20, 8).notNullable()
      table.decimal('close', 20, 8).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
