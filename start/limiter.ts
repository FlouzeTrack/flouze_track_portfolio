/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'
import app from '@adonisjs/core/services/app'

export const throttle = limiter.define('global', () => {
  // Skip rate limiting in test environment
  if (app.inTest) {
    return limiter.allowRequests(1000).every('1 second')
  }
  return limiter
    .allowRequests(100)
    .every('1 minute')
    .limitExceeded((error) => {
      error.setStatus(400).setMessage('Rate limit attained. Try again later')
    })
    .blockFor('5 mins')
})

export const apiThrottle = limiter.define('api', (ctx) => {
  /**
   * Allow logged-in users to make 100 requests by
   * their user ID
   */
  if (ctx.auth.user) {
    return limiter
      .allowRequests(100)
      .every('1 minute')
      .usingKey(`user_${ctx.auth.user.id}`)
      .limitExceeded((error) => {
        error.setStatus(400).setMessage('Rate limit attained. Try again later')
      })
  }

  /**
   * Allow guest users to make 10 requests by ip address
   */
  return limiter
    .allowRequests(10)
    .every('1 minute')
    .usingKey(`ip_${ctx.request.ip()}`)
    .limitExceeded((error) => {
      error.setStatus(400).setMessage('Rate limit attained. Try again later')
    })
})
