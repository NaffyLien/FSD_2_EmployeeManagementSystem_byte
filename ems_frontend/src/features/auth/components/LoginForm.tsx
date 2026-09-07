import type { FormEvent } from 'react'
import { Button } from '../../../components/Button/Button.tsx'
import { Input } from '../../../components/Input/Input.tsx'

interface LoginFormProps {
  onSubmit: (e: FormEvent) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  error: string
  loading: boolean
}

export function LoginForm({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
}: LoginFormProps) {
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <div className="text-center mb-2">
        <h1 className="text-[26px] font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-[15px] text-slate-500">Sign in to access the admin dashboard</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-medium">{error}</div>}

      <Input
        label="Email"
        type="email"
        placeholder="admin@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
        Sign In
      </Button>
    </form>
  )
}
