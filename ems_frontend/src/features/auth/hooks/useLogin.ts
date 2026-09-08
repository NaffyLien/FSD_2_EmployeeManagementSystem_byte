import { useState, useCallback } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authApi.ts'
import { useAuthStore } from '../../../store/authStore.ts'
import type { User } from '../../../utils/types.ts'

export function useLogin() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const loginAction = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setError('')

      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password')
        return
      }

      setLoading(true)
      try {
        const response = await login({ email: email.trim(), password })
        const fakeUser: User = { id: 0, email: email.trim() }
        localStorage.setItem('ems_token', response.token)
        localStorage.setItem('ems_refresh_token', response.refreshToken)
        localStorage.setItem('ems_user', JSON.stringify(fakeUser))
        loginAction(response.token, response.refreshToken, fakeUser)
        navigate('/employees', { replace: true })
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Invalid credentials'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [email, password, loginAction, navigate]
  )

  return { email, setEmail, password, setPassword, error, loading, handleSubmit }
}
