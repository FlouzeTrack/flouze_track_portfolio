import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('wallet_id').notNullable().references('id').inTable('wallets')
      table.uuid('user_id').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
