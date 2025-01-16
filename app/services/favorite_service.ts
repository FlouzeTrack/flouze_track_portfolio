import Favorite from '#models/favorite'

export default class FavoriteService {
  public async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    const favorites = Favorite.query()
      .where('user_id', userId)
      .preload('wallet', (query) => {
        query.select('address')
      })
      .select('id')
    return favorites
  }
}
