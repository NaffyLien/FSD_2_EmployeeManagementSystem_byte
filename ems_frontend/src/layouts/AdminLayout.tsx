import { useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.ts'
import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  const location = useLocation()
  const logout = useAuthStore((s: { logout: () => void }) => s.logout)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const isActive = (path: string) =>
    location.pathname === path || (path === '/' && location.pathname === '/')

  const linkClass = (path: string) => {
    const active = isActive(path)
    const base = 'flex items-center gap-3 py-3.5 px-0 md:py-3 md:px-4 rounded-lg text-[15px] font-medium no-underline transition-all duration-200 border-0 bg-transparent cursor-pointer w-full justify-center md:justify-start'
    const colors = active ? 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50'
    return `${base} ${colors}`.trim()
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed top-0 left-0 bottom-0 z-[100] w-[70px] md:w-[260px] bg-slate-900 text-slate-50 flex flex-col">
        <div className="px-2 py-5 md:px-6 md:py-7 border-b border-slate-800 text-center md:text-left">
          <h1 className="text-xl font-bold m-0 tracking-wider"><span className="hidden md:inline">EMS</span></h1>
          <p className="text-xs text-slate-400 mt-1"><span className="hidden md:inline">Admin Panel</span></p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link to="/" className={linkClass('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/employees" className={linkClass('/employees')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="hidden md:inline">Employees</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-2.5 w-full py-3.5 px-0 md:py-3 md:px-4 rounded-lg text-red-400 text-sm font-medium bg-transparent border border-red-900 cursor-pointer transition-all duration-200 justify-center md:justify-start hover:bg-red-900 hover:text-red-200" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>
      <main className="ml-[70px] md:ml-[260px] flex-1 p-5 md:p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
