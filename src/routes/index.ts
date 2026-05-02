import { Router } from "express";
import authRoutes  from "../modules/auth/authRoutes";
import notificationRoutes from "../modules/notifications/notificationRoutes"; 
const routers = Router();

routers.use("/auth", authRoutes);
routers.use("/notification", notificationRoutes);

export default  routers;