import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prismaClient from "../prismaClient";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const login = async (request: Request, response: Response) => {
  const result = loginSchema.safeParse(request.body);
  const secret = process.env.JWT_SECRET;

  if (!result.success || !secret) {
    response.status(400).json({ message: "Invalid login configuration or credentials" });
    return;
  }

  const admin = await prismaClient.admin.findUnique({
    where: { email: result.data.email },
  });

  if (!admin || !(await bcrypt.compare(result.data.password, admin.password))) {
    response.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ sub: admin.id, role: "admin" }, secret, { expiresIn: "1h" });
  response.json({ token });
};
