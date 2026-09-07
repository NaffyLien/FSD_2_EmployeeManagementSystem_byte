import { useState, useEffect, useMemo, useCallback } from 'react'
import { fetchEmployees } from '../services/employeeApi.ts'
import type { Employee } from '../../../utils/types.ts'

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchEmployees()
      setEmployees(data)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to load employees'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const addEmployee = useCallback((employee: Employee) => {
    setEmployees((prev) => [...prev, employee])
  }, [])

  const updateEmployee = useCallback((updated: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updated.id ? updated : emp))
    )
  }, [])

  const removeEmployee = useCallback((id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }, [])

  return { employees, loading, error, reload: loadEmployees, addEmployee, updateEmployee, removeEmployee }
}

export function useFilteredEmployees(
  employees: Employee[],
  searchQuery: string,
  departmentFilter: string
) {
  return useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchQuery ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.post.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDept = !departmentFilter || emp.department === departmentFilter
      return matchesSearch && matchesDept
    })
  }, [employees, searchQuery, departmentFilter])
}
