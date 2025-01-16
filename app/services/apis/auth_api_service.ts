import env from '#start/env'
import { AuthUser } from '#types/api_auth_user_type'

export default class AuthApiService {
  private readonly baseUrl = env.get('AUTH_API_BASE_URL')

  public async getMe(token: string): Promise<AuthUser> {
    const response = await this.fetchData<AuthUser>('/auth/me', {
      Authorization: `Bearer ${token}`,
    })
    return response
  }

  private async fetchData<T>(endPoint: string, headers: Record<string, string> = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endPoint}`
      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = (await response.json()) as T

      return data
    } catch (error) {
      throw new Error('Failed to fetch data')
    }
  }
}
