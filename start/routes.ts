import router from '@adonisjs/core/services/router'
const CryptoPriceController = () => import('#controllers/crypto_price_controller')
const WalletController = () => import('#controllers/wallet_controller')

// Health check endpoint
router.get('/', async () => ({ status: 'ok' }))

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.get('/:address?', [WalletController, 'getTransactions'])
            router.get('/:address/export', [WalletController, 'getTransactions'])
          })
          .prefix('/wallet')
        router
          .group(() => {
            router.get('/', [CryptoPriceController, 'getPrices'])
          })
          .prefix('/prices')
      })
      .prefix('/v1')
  })
  .prefix('/api')
