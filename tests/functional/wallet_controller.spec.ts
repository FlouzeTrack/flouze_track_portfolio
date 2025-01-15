import { test } from '@japa/runner'

test.group('Wallet Controller', () => {
  const validAddress = '0x7bBAEc06d8e30e0A7254491f1984Df7d204f12b2' // easy
  // const validAddress = '0xd0b08671eC13B451823aD9bC5401ce908872e7c5' // medium
  // const validAddress = '0x7c9a30adE9FfB2bE0540bCe604A5c717264C7676' // hard
  // const validAddress = '0x7bBAEc06d8e30e0A7254491f1984Df7d204f12b2' // very hard
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

  // test('should handle missing address parameter', async ({ client }) => {
  //   const response = await client.get('/api/v1/wallet')

  //   response.assertStatus(200)
  //   response.assertBodyContains({
  //     address: validAddress,
  //   })
  // })

  test('should validate address with regex', async ({ assert }) => {
    const validator = /^0x[a-fA-F0-9]{40}$/

    assert.isTrue(validator.test(validAddress))
    assert.isTrue(validator.test('0x1234567890123456789012345678901234567890'))

    assert.isFalse(validator.test(invalidAddress))
    assert.isFalse(validator.test('0x123'))
    assert.isFalse(validator.test('123456789012345678901234567890123456789'))
    assert.isFalse(validator.test('0xGHIJKLMNOPQRSTUVWXYZ1234567890123456789'))
  })

  // test('should return formatted transactions', async ({ client, assert }) => {
  //   const response = await client.get(`/api/v1/wallet/${validAddress}`)

  //   response.assertStatus(200)
  //   const transactions = response.body().transactions

  //   assert.isArray(transactions)
  //   transactions.forEach((tx: any) => {
  //     assert.properties(tx, [
  //       'hash',
  //       'symbol',
  //       'currency',
  //       'value',
  //       'date',
  //       'from',
  //       'to',
  //       'isError',
  //       'gasUsed',
  //     ])
  //     assert.equal(tx.symbol, 'ETH')
  //     assert.equal(tx.currency, 'ETH')
  //     assert.isBoolean(tx.isError)
  //   })
  // })

  test('balance history should match Etherscan balance', async ({ client, assert }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}/balances`)

    response.assertStatus(200)
    const { currentBalance, history } = response.body()

    // Ensure we have history
    assert.isArray(history)
    assert.isNotEmpty(history)

    // Get last calculated balance
    const lastBalance = history[history.length - 1]
    assert.exists(lastBalance)

    // Convert both balances to BigInt for comparison
    const calculatedBalanceWei = BigInt(lastBalance.value)
    const etherscanBalanceWei = BigInt(currentBalance)

    // Calculate difference in ETH (divide by 1e18)
    const diffInEth = Number(calculatedBalanceWei - etherscanBalanceWei) / 1e18

    // Allow 0.1 ETH tolerance for gas calculations
    assert.isTrue(
      Math.abs(diffInEth) < 0.1,
      `Balance difference (${diffInEth} ETH) exceeds tolerance`
    )
  })
})
