import { Router } from "express";
import authRoutes  from "../modules/auth/authRoutes";
import notificationRoutes from "../modules/notifications/notificationRoutes"; 
import userRoutes from "../modules/users/userRoutes";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const routers = Router();

routers.use("/auth", authRoutes);
routers.use("/user", userRoutes );
routers.use("/notification", notificationRoutes);

export default  routers;