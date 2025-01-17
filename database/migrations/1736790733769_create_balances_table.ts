import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'balances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('wallet_address').notNullable()
      table.string('currency').notNullable()
      table.text('data').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      // Index composite
      table.unique(['wallet_address', 'currency'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
