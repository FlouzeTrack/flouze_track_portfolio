import { test } from '@japa/runner'

test.group('Export Controller', () => {
  const validAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  const invalidAddress = '0xinvalid'

  test('should export transactions in CSV format', async ({ client, assert }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}/export`)

    response.assertStatus(200)
    response.assertHeader('content-type', 'text/csv')
    response.assertHeader(
      'content-disposition',
      `attachment; filename="wallet-${validAddress}.csv"`
    )

    const content = response.text()
    assert.isString(content)
    assert.include(content, 'Hash,Date,From,To,Value,Currency,Gas Used,Status')
  })

  test('should export transactions in JSON format', async ({ client, assert }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}/export?format=json`)

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/json')
    response.assertHeader(
      'content-disposition',
      `attachment; filename="wallet-${validAddress}.json"`
    )

    const content = response.body()
    assert.isArray(content)
    if (content.length > 0) {
      assert.properties(content[0], [
        'hash',
        'date',
        'from',
        'to',
        'value',
        'currency',
        'gasUsed',
        'status',
      ])
    }
  })

  test('should return 400 for invalid format', async ({ client }) => {
    const response = await client.get(`/api/v1/wallet/${validAddress}/export?format=xml`)

    response.assertStatus(400)
    response.assertBodyContains({
      error: 'Invalid format',
      message: 'Unsupported export format: xml',
    })
  })

  test('should validate ethereum address for export', async ({ client }) => {
    const response = await client.get(`/api/v1/wallet/${invalidAddress}/export`)

    response.assertStatus(400)
    response.assertBodyContains({
      error: 'Validation failure',
      message: 'The address field format is invalid',
      errors: [
        {
          field: 'address',
          message: 'The address field format is invalid',
          rule: 'regex',
        },
      ],
    })
  })

  test('should handle missing address parameter', async ({ client }) => {
    const response = await client.get('/api/v1/wallet//export')

    response.assertStatus(400)
    response.assertBodyContains({
      error: 'Validation failure',
    })
  })
})
