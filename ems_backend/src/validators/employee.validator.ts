import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  post: z.string().min(1),
  department: z.string().min(1),
  salary: z.number().int().nonnegative(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
