import { api } from '../../../utils/api.ts'
import type { LoginPayload, LoginResponse } from '../../../utils/types.ts'

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}
