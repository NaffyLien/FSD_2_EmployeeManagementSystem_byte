import { Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore.ts'
import { Button } from '../../../components/Button/Button.tsx'

export function HomePage() {
  const isAuthenticated = useAuthStore((s: { isAuthenticated: boolean }) => s.isAuthenticated)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Employee Management System
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            A powerful tool to manage your workforce efficiently. Create, edit, and organize employee records with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <Link to="/employees">
                <Button size="lg" className="min-w-[200px]">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="min-w-[200px]">
                  Sign In to Get Started
                </Button>
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Manage Employees</h3>
              <p className="text-slate-600 text-sm">
                Add, edit, and organize employee information including name, email, department, and salary.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Dashboard Overview</h3>
              <p className="text-slate-600 text-sm">
                View all employees at a glance with search and filter capabilities by department.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Access</h3>
              <p className="text-slate-600 text-sm">
                Protected by JWT authentication. Only authorized admins can modify employee records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
