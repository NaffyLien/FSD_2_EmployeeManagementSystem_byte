import cors from "cors";
import express from "express";
import employeeRouter from "./routes/employee.routes";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/employees", employeeRouter);
app.use("/api/auth", authRouter);

export default app;
