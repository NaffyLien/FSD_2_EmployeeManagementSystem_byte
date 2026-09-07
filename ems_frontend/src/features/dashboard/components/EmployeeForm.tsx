import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/Button/Button.tsx'
import { Input } from '../../../components/Input/Input.tsx'
import { createEmployee, updateEmployee } from '../services/employeeApi.ts'
import type { Employee, CreateEmployeePayload } from '../../../utils/types.ts'

interface EmployeeFormProps {
  employee: Employee | null
  onSaved: (emp: Employee) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, onSaved, onCancel }: EmployeeFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [post, setPost] = useState('')
  const [department, setDepartment] = useState('')
  const [salary, setSalary] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (employee) {
      setName(employee.name)
      setEmail(employee.email)
      setPost(employee.post)
      setDepartment(employee.department)
      setSalary(employee.salary.toString())
    } else {
      setName('')
      setEmail('')
      setPost('')
      setDepartment('')
      setSalary('')
    }
    setErrors({})
    setApiError('')
  }, [employee])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Invalid email format'
    }
    if (!post.trim()) newErrors.post = 'Post is required'
    if (!department.trim()) newErrors.department = 'Department is required'
    if (!salary.trim()) {
      newErrors.salary = 'Salary is required'
    } else if (isNaN(Number(salary)) || Number(salary) < 0) {
      newErrors.salary = 'Salary must be a non-negative number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    setLoading(true)
    try {
      const payload: CreateEmployeePayload = {
        name: name.trim(),
        email: email.trim(),
        post: post.trim(),
        department: department.trim(),
        salary: Number(salary),
      }

      let result: Employee
      if (employee) {
        result = await updateEmployee(employee.id, payload)
      } else {
        result = await createEmployee(payload)
      }

      onSaved(result)
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Operation failed'
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {apiError && (
        <div className="p-3 px-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-medium">
          {apiError}
        </div>
      )}

      <Input
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Grace Hopper"
        error={errors.name}
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="grace.hopper@example.com"
        error={errors.email}
      />

      <Input
        label="Post / Job Title"
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="Software Engineer"
        error={errors.post}
      />

      <Input
        label="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="Engineering"
        error={errors.department}
      />

      <Input
        label="Salary (USD)"
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="95000"
        error={errors.salary}
      />

      <div className="flex justify-end gap-2.5 mt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {employee ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </form>
  )
}
