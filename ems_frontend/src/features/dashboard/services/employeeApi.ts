import { api } from '../../../utils/api.ts'
import type { Employee, CreateEmployeePayload, UpdateEmployeePayload } from '../../../utils/types.ts'

export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await api.get<{ employees: Employee[]; status: number }>('/employees')
  return data.employees
}

export async function fetchEmployee(id: number): Promise<Employee> {
  const { data } = await api.get<{ employee: Employee; status: number }>(`/employees/${id}`)
  return data.employee
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const { data } = await api.post<{ employee: Employee; status: number }>('/employees', payload)
  return data.employee
}

export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload
): Promise<Employee> {
  const { data } = await api.patch<{ employee: Employee; status: number }>(`/employees/${id}`, payload)
  return data.employee
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/${id}`)
}
