import ETHPrice from '#models/eth_price'
import { HttpContext } from '@adonisjs/core/http'
import { currencyValidator } from '#validators/currency'

export default class PriceController {
  public async getPrices({ response }: any) {
    const prices = await ETHPrice.query().orderBy('timestamp', 'desc').limit(10)
    return response.json(prices)
  }

  public async fetchPrices({ request, response }: HttpContext): Promise<any> {
    try {
      const payload = await this.currencyValidator.validate({
        currency: request.param('currency', 'ETH'),
      })

      return { message: 'Prices fetched successfully' }
    } catch (error) {
      console.error('Error while fetching : ', error)
      return { message: 'Failed to fetch prices', error: error.message }
    }
  }
}
