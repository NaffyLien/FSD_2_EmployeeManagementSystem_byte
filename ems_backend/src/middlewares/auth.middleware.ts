import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    response.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    jwt.verify(token, secret);
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token" });
  }
};
