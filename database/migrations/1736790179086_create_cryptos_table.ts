import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cryptos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.string('symbol', 20).notNullable()
      table.string('name', 100).notNullable()
      table.decimal('value', 20, 6).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
