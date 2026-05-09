import { Router } from "express";
import { notificationController } from "./notificationController";
import { validateRequest } from "../../middlewares/validateRequest";
import { createNotificationSchema } from "./dto/notificationSchema";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
const notificationRoute = Router();

notificationRoute.post("/create-notification",authMiddleware,roleMiddleware("SUPERADMIN", "ADMIN"),
                  validateRequest(createNotificationSchema), notificationController.createNotification );
notificationRoute.get("/get-notification",authMiddleware,  notificationController.getMyNotifications );
notificationRoute.get("/:id/read",authMiddleware,  notificationController.markAsRead );
notificationRoute.get("/read-all",authMiddleware,  notificationController.markAllAsRead );

export default  notificationRoute;