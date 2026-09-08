import { api } from '../../../utils/api.ts'
import type { RefreshResponse } from '../../../utils/types.ts'

export async function refreshAuth(): Promise<RefreshResponse> {
  const refreshToken = localStorage.getItem('ems_refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const { data } = await api.post<RefreshResponse>('/auth/refresh', {
    refreshToken,
  })

  return data
}
