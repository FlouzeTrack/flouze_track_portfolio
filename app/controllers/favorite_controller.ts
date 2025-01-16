import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ErrorHandlerService } from '#services/error_handler_service'
import FavoriteService from '#services/favorite_service'
import { walletAddressValidator } from '#validators/wallet/address'

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
      const favorites = await this.favoriteService.getFavoritesByUser(user.id)
      return response.json(favorites)
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'fetch favorites data')
    }
  }

  public async createFavorite({ request, response, auth }: HttpContext): Promise<void> {
    try {
      const body = await walletAddressValidator.validate({ address: request.body().address })
      const user = await auth.authenticate()
      const favorites = await this.favoriteService.createFavorite(user.id, body.address)
      return response.json(favorites)
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'create favorites data')
    }
  }

  public async deleteFavorite({ request, response, auth }: HttpContext): Promise<void> {
    try {
      const { id } = request.params()
      const user = await auth.authenticate()
      const favorites = await this.favoriteService.deleteFavorite(id, user.id)
      return response.json(favorites)
    } catch (error) {
      this.errorHandler.handle(error, { request, response }, 'delete favorites data')
    }
  }
}
