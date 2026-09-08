import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prismaClient from "../prismaClient";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const createAccessToken = (adminId: number, secret: string) =>
  jwt.sign({ sub: adminId, role: "admin", type: "access" }, secret, { expiresIn: "1h" });

const createRefreshToken = (adminId: number, secret: string) =>
  jwt.sign({ sub: adminId, role: "admin", type: "refresh" }, secret, { expiresIn: "7d" });

export const login = async (request: Request, response: Response) => {
  const result = loginSchema.safeParse(request.body);
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!result.success || !accessSecret || !refreshSecret) {
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

  response.json({
    token: createAccessToken(admin.id, accessSecret),
    refreshToken: createRefreshToken(admin.id, refreshSecret),
  });
};

export const refresh = async (request: Request, response: Response) => {
  const result = refreshSchema.safeParse(request.body);
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!result.success || !accessSecret || !refreshSecret) {
    response.status(400).json({ message: "Invalid refresh token configuration or request" });
    return;
  }

  try {
    const payload = jwt.verify(result.data.refreshToken, refreshSecret);

    if (
      typeof payload === "string" ||
      payload.type !== "refresh" ||
      payload.role !== "admin" ||
      typeof payload.sub !== "string" ||
      !Number.isInteger(Number(payload.sub)) ||
      Number(payload.sub) <= 0
    ) {
      response.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    response.json({ token: createAccessToken(Number(payload.sub), accessSecret) });
  } catch {
    response.status(401).json({ message: "Invalid or expired refresh token" });
  }
};
