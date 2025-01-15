import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crypto_prices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.integer('timestamp').notNullable()
      table.decimal('high', 20, 6).notNullable()
      table.decimal('low', 20, 6).notNullable()
      table.decimal('open', 20, 6).notNullable()
      table.decimal('close', 20, 6).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
