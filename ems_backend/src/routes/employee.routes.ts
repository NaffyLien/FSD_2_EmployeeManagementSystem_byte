import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../controller/employee.controller";

const employeeRouter = Router();

employeeRouter.post("/", requireAdmin, createEmployee);
employeeRouter.get("/", getEmployees);
employeeRouter.get("/:id", getEmployee);
employeeRouter.patch("/:id", requireAdmin, updateEmployee);
employeeRouter.delete("/:id", requireAdmin, deleteEmployee);

export default employeeRouter;
