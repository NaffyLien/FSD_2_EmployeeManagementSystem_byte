import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#312e81] p-6">
      <div className="w-full max-w-[420px] bg-white rounded-2xl p-10 px-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-[480px]:p-8 max-[480px]:px-5 max-[480px]:rounded-xl">
        <Outlet />
      </div>
    </div>
  )
}
