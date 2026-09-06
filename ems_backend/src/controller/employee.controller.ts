import { Request, Response } from "express";
import employeeService from "../services/employee";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validators/employee.validator";

const getEmployeeId = (request: Request, response: Response): number | null => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({ message: "Employee id must be a positive integer" });
    return null;
  }

  return id;
};

export const createEmployee = async (request: Request, response: Response) => {
  const result = createEmployeeSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({ message: "Invalid employee data", errors: result.error.issues });
    return;
  }

  const employee = await employeeService.addEmployee(result.data);
  response.status(201).json({employee, status: 200});
};

export const getEmployees = async (_request: Request, response: Response) => {
  const employees = await employeeService.getAllEmployee();
  response.json({employees, status: 200});
};

export const getEmployee = async (request: Request, response: Response) => {
  const id = getEmployeeId(request, response);
  if (id === null) return;

  const employee = await employeeService.getOneEmployee(id);

  if (!employee) {
    response.status(404).json({ message: "Employee not found" });
    return;
  }

  response.json({employee, status: 200});
};

export const updateEmployee = async (request: Request, response: Response) => {
  const id = getEmployeeId(request, response);
  if (id === null) return;

  const result = updateEmployeeSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({ message: "Invalid employee data", errors: result.error.issues });
    return;
  }

  const updateData = Object.fromEntries(
    Object.entries(result.data).filter(([, value]) => value !== undefined),
  );
  const employee = await employeeService.updateEmployee(id, updateData);
  response.json({employee, status: 200});
};

export const deleteEmployee = async (request: Request, response: Response) => {
  const id = getEmployeeId(request, response);
  if (id === null) return;

  await employeeService.deleteEmployee(id);
  response.status(204).send();
};
