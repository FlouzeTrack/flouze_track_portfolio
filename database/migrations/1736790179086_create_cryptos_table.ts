import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cryptos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('symbol', 20).notNullable()
      table.string('name', 100).notNullable()
      table.double('value').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
