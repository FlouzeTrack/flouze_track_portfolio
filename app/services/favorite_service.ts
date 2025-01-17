import Favorite from '#models/favorite'

export default class FavoriteService {
  public async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    // const favorites = Favorite.query()
    //   .where('user_id', userId)
    //   .preload('wallet', (query) => {
    //     query.select('address')
    //   })
    //   .select('id')
    const favorites = await Favorite.query().where('user_id', userId).select('id', 'wallet_address', 'label')
    return favorites
  }

  public async createFavorite(userId: string, walletAddress: string, label?: string): Promise<Favorite> {
    // const rows = db.table('crypto_prices').returning('id').insert({
    //   timestamp: priceData.timestamp,
    //   high: priceData.high,
    //   low: priceData.low,
    //   open: priceData.open,
    //   close: priceData.close,
    // })
    const favorite = await Favorite.create({ 
      user_id: userId, 
      wallet_address: walletAddress,
      label: label || null 
    })
    return favorite
  }

  public async deleteFavorite(id: string, userId: string): Promise<Favorite> {
    // const rows = db.table('crypto_prices').returning('id').insert({
    //   timestamp: priceData.timestamp,
    //   high: priceData.high,
    //   low: priceData.low,
    //   open: priceData.open,
    //   close: priceData.close,
    // })
    const favorite = await Favorite.query().where('id', id).where('user_id', userId).firstOrFail()
    await favorite.delete()
    return favorite
  }

  public async updateFavorite(
    id: string, 
    userId: string, 
    data: { 
      address: string,
      label: string 
    }
  ): Promise<Favorite> {
    const favorite = await Favorite.query()
      .where('id', id)
      .where('user_id', userId)
      .firstOrFail()
  
    favorite.wallet_address = data.address
    favorite.label = data.label
    await favorite.save()
    
    return favorite
  }
}
