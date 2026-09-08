import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../utils/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (token: string, refreshToken: string, user: User) => void
  setTokens: (token: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (token, refreshToken, user) =>
        set({ token, refreshToken, user, isAuthenticated: true }),
      setTokens: (token, refreshToken) =>
        set({ token, refreshToken }),
      logout: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'ems_auth',
    }
  )
)
