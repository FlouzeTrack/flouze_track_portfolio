import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', async () => {
      return {
        hello: 'world',
      }
    })
    router.get('/prices/:currency?', '#controllers/price_controller.fetchPrices')
  })
  .prefix('api/v1')
