import { useState, useMemo, useCallback } from 'react'
import { Button } from '../../../components/Button/Button.tsx'
import { Modal } from '../../../components/Modal/Modal.tsx'
import { EmployeeForm } from './EmployeeForm'
import { DeleteModal } from './DeleteModal'
import { deleteEmployee } from '../services/employeeApi.ts'
import type { Employee } from '../../../utils/types.ts'

interface EmployeeListProps {
  employees: Employee[]
  loading: boolean
  error: string
  onReload: () => void
  onUpdated: (emp: Employee) => void
  onDeleted: (id: number) => void
  onAdded: (emp: Employee) => void

}

export function EmployeeList({
  employees,
  loading,
  error,
  onReload,
  onAdded,
  onUpdated,
  onDeleted,
}: EmployeeListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))].sort(),
    [employees]
  )

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.post.toLowerCase().includes(q)

      const matchesDept = !deptFilter || emp.department === deptFilter
      return matchesSearch && matchesDept
    })
  }, [employees, searchQuery, deptFilter])

  const handleAdd = useCallback(() => {
    setEditingEmployee(null)
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback((emp: Employee) => {
    setEditingEmployee(emp)
    setModalOpen(true)
  }, [])

  const handleSaved = useCallback(
    (emp: Employee) => {
      if (editingEmployee) {
        onUpdated(emp)
      } else {
        onAdded(emp)
      }
      setModalOpen(false)
      setEditingEmployee(null)
    },
    [editingEmployee, onAdded, onUpdated]
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    setDeleteError('')
    try {
      await deleteEmployee(deleteTarget.id)
      onDeleted(deleteTarget.id)
      setDeleteTarget(null)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Failed to delete employee'
      setDeleteError(message)
    }
  }, [deleteTarget, onDeleted])

  const formatSalary = (salary: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold text-slate-900 m-0">Employees</h2>
          <span className="text-sm text-slate-500">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap max-lg:w-full">
          <input
            type="text"
            className="max-lg:flex-1 max-lg:min-w-0 px-[14px] py-[9px] border-[1.5px] border-[#d1d5db] rounded-lg text-sm min-w-[220px] text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/12 [font-family:inherit]"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-[14px] py-[9px] border-[1.5px] border-[#d1d5db] rounded-lg text-sm text-gray-900 bg-white cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/12 [font-family:inherit]"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <Button onClick={handleAdd}>+ Add Employee</Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-[14px_18px] bg-red-50 border border-red-200 rounded-[10px] text-red-700 text-sm font-medium">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={onReload}>
            Retry
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-12 px-6 text-center text-slate-500">Loading employees...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 px-6 text-center text-slate-500">
            <p className="m-0 mb-4 text-[15px]">No employees found.</p>
            <Button onClick={handleAdd}>Add First Employee</Button>
          </div>
        ) : (
          <>
            <div className="table w-full max-[1200px]:hidden">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-[14px] text-left font-semibold text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">Name</th>
                    <th className="px-5 py-[14px] text-left font-semibold text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">Email</th>
                    <th className="px-5 py-[14px] text-left font-semibold text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">Post</th>
                    <th className="px-5 py-[14px] text-left font-semibold text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">Department</th>
                    <th className="px-5 py-[14px] text-left font-semibold text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">Salary</th>
                    <th className="px-5 py-[14px] text-left font-semibold text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-5 py-[14px] border-b border-slate-100 text-slate-800 align-middle last:border-b-0 font-semibold text-slate-900">{emp.name}</td>
                      <td className="px-5 py-[14px] border-b border-slate-100 text-slate-800 align-middle last:border-b-0">{emp.email}</td>
                      <td className="px-5 py-[14px] border-b border-slate-100 text-slate-800 align-middle last:border-b-0">{emp.post}</td>
                      <td className="px-5 py-[14px] border-b border-slate-100 text-slate-800 align-middle last:border-b-0">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">{emp.department}</span>
                      </td>
                      <td className="px-5 py-[14px] border-b border-slate-100 text-slate-800 align-middle last:border-b-0 font-mono font-medium text-emerald-600">{formatSalary(emp.salary)}</td>
                      <td className="px-5 py-[14px] border-b border-slate-100 text-slate-800 align-middle last:border-b-0">
                        <div className="flex gap-1.5">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(emp)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hidden max-[1200px]:block">
              {filtered.map((emp) => (
                <div key={emp.id} className="p-4 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-base font-bold text-slate-900 m-0">{emp.name}</p>
                      <p className="text-sm text-slate-500 m-0 mt-0.5">{emp.email}</p>
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold whitespace-nowrap">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-slate-600">
                      <span className="text-slate-400">Post:</span> {emp.post}
                    </div>
                    <div className="font-mono font-medium text-emerald-600 text-sm">
                      {formatSalary(emp.salary)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(emp)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingEmployee(null) }} title={editingEmployee ? 'Edit Employee' : 'Add Employee'} size="md">
        <EmployeeForm employee={editingEmployee} onSaved={handleSaved} onCancel={() => { setModalOpen(false); setEditingEmployee(null) }} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => { setDeleteTarget(null); setDeleteError('') }} title="Confirm Delete" size="sm">
        {deleteTarget && (
          <>
            {deleteError && (
              <div className="mb-4 p-3 px-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-medium">
                {deleteError}
              </div>
            )}
            <DeleteModal
              employeeName={deleteTarget.name}
              onConfirm={handleDeleteConfirm}
              onCancel={() => { setDeleteTarget(null); setDeleteError('') }}
            />
          </>
        )}
      </Modal>
    </div>
  )
}
