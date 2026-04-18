import { Router } from "express";
import authRoutes  from "../modules/auth/authRoutes";
const routers = Router();

routers.use("/auth", authRoutes);

export default  routers;