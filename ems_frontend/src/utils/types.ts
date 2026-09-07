export interface User {
  id: number
  email: string
}

export interface Employee {
  id: number
  name: string
  email: string
  post: string
  department: string
  salary: number
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface CreateEmployeePayload {
  name: string
  email: string
  post: string
  department: string
  salary: number
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>
