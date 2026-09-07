import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './hooks/useAuth'
import { LoginForm, useLogin } from './features/auth'
import { EmployeeList, useEmployees } from './features/dashboard'

function DashboardPage() {
  const { employees, loading, error, reload, updateEmployee, removeEmployee } =
    useEmployees()

  return (
    <EmployeeList
      employees={employees}
      loading={loading}
      error={error}
      onReload={reload}
      onUpdated={updateEmployee}
      onDeleted={removeEmployee}
    />
  )
}

function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin()

  return (
    <LoginForm
      onSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="employees" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
