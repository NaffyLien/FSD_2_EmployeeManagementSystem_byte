import { Router } from "express";
import { login, refresh } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/refresh", refresh);

export default authRouter;
