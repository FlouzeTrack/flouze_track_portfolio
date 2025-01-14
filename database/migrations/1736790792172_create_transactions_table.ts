import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at').notNullable()
      table.integer('quantity').notNullable()
      table.boolean('is_error').notNullable()
      table.integer('gas_used').notNullable()
      table.string('hash').notNullable()
      table.string('from').notNullable().references('id').inTable('wallets')
      table.string('to').notNullable().references('id').inTable('wallets')
      table.integer('crypto_id').notNullable().unsigned().references('id').inTable('cryptos')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
