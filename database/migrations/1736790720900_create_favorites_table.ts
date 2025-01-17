import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('wallet_address').notNullable()
      table.string('label').notNullable()
      // table.uuid('wallet_id').notNullable().references('id').inTable('wallets')
      table.uuid('user_id').notNullable()
      // Ajoute un index unique composite
      table.unique(['user_id', 'wallet_address'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
