import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'balances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.integer('quantity')
      table.uuid('wallet_id').notNullable().references('id').inTable('wallets')
      table.integer('crypto_id').unsigned().notNullable().references('id').inTable('cryptos')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
