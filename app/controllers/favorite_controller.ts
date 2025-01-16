import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ErrorHandlerService } from '#services/error_handler_service'
import FavoriteService from '#services/favorite_service'

@inject()
export default class FavoriteController {
  private favoriteService: FavoriteService
  private readonly errorHandler: ErrorHandlerService

  constructor() {
    this.favoriteService = new FavoriteService()
    this.errorHandler = new ErrorHandlerService()
  }

  public async getFavorites({ request, response, auth }: HttpContext): Promise<void> {
    try {
      const user = await auth.authenticate()
      console.log('user', user)
      const favorites = await this.favoriteService.getFavoritesByUser(user.id)
      return response.json(favorites)
    } catch (error) {
      console.log(error)
      this.errorHandler.handle(error, { request, response }, 'fetch favorites data')
    }
  }
}
