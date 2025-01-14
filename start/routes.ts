import router from '@adonisjs/core/services/router'

router
  .group(() => {
    // Health check endpoint
    router.get('/health', async () => ({ status: 'ok' }))

    router
      .group(() => {
        router
          .group(() => {
            router.get('/:address?', '#controllers/wallet_controller.getTransactions')
            router.get('/:address/export', '#controllers/wallet_controller.exportTransactions')
          })
          .prefix('/wallet')

        router.get('/prices/:currency?', '#controllers/price_controller.fetchPrices')
      })
      .prefix('/v1')
  })
  .prefix('/api')
