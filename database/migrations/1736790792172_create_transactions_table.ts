import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('date').notNullable()
      table.string('value').notNullable()
      table.boolean('is_error').notNullable()
      table.string('gas_used').notNullable()
      table.string('hash').notNullable()
      table.uuid('from').notNullable().references('id').inTable('wallets')
      table.uuid('to').notNullable().references('id').inTable('wallets')
      table.integer('crypto_id').notNullable().unsigned().references('id').inTable('cryptos')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
