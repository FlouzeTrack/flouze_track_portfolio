import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'balances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .string('wallet_id')
        .notNullable()
        .references('id')
        .inTable('wallets')
        .onDelete('CASCADE')

      table.integer('quantity')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
