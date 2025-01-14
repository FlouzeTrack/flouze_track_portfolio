import cron from 'node-cron'
import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'
import CryptoCompareService from '#services/crypto_compare_service'
import PriceService from '#services/price_service'

// const cryptoCompareService = new CryptoCompareService()
// const priceService = new PriceService(cryptoCompareService)

// cron.schedule(
//   // '0 0 * * *',
//   '* * * * *',
//   async () => {
//     try {
//       console.log('Fetching currency prices...')
//       await priceService.fetchAndSavePrices('ETH')
//       console.log('Prices fetched successfully:')
//     } catch (error) {
//       console.error('Error fetching prices: ', error)
//     }
//   },
//   {
//     scheduled: true,
//     timezone: 'Europe/Paris', // Set your desired timezone
//   }
// )

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
})
