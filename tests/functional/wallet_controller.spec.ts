import { test } from '@japa/runner'

test.group('Wallet Controller', () => {
  const validAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  const invalidAddress = '0xinvalid'

  test('should return wallet info for valid address', async ({ client }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}`)

    response.assertStatus(200)
    response.assertBodyContains({
      address: validAddress,
      ethBalance: response.body().ethBalance,
      transactions: response.body().transactions,
    })
  })

  test('should validate ethereum address format', async ({ client }) => {
    const response = await client.get(`/api/v1/wallet/${invalidAddress}`)

    response.assertStatus(400)
  })

  test('should handle missing address parameter', async ({ client }) => {
    const response = await client.get('/api/v1/wallet')

    response.assertStatus(200)
    response.assertBodyContains({
      address: validAddress,
    })
  })

  test('should validate address with regex', async ({ assert }) => {
    const validator = /^0x[a-fA-F0-9]{40}$/

    assert.isTrue(validator.test(validAddress))
    assert.isTrue(validator.test('0x1234567890123456789012345678901234567890'))

    assert.isFalse(validator.test(invalidAddress))
    assert.isFalse(validator.test('0x123'))
    assert.isFalse(validator.test('123456789012345678901234567890123456789'))
    assert.isFalse(validator.test('0xGHIJKLMNOPQRSTUVWXYZ1234567890123456789'))
  })

  test('should return formatted transactions', async ({ client, assert }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}`)

    response.assertStatus(200)
    const transactions = response.body().transactions

    assert.isArray(transactions)
    transactions.forEach((tx: any) => {
      assert.properties(tx, [
        'hash',
        'symbol',
        'currency',
        'value',
        'date',
        'from',
        'to',
        'isError',
        'gasUsed',
      ])
      assert.equal(tx.symbol, 'ETH')
      assert.equal(tx.currency, 'ETH')
      assert.isBoolean(tx.isError)
    })
  })

  test('should limit transactions to 10', async ({ client, assert }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}`)

    response.assertStatus(200)
    assert.isAtMost(response.body().transactions.length, 10)
  })
})
