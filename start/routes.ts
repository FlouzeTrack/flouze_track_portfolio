import router from '@adonisjs/core/services/router'
import { throttle } from './limiter.js'
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
            router.get('/:address/balances', [WalletController, 'getBalances'])
          })
          .prefix('/wallet')
        router
          .group(() => {
            router.get('/', [CryptoPriceController, 'getPrices'])
          })
          .prefix('/prices')
      })
      .prefix('/v1')
      .use(throttle)
  })
  .prefix('/api')
