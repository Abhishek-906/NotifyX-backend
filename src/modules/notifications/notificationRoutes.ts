import { Router } from "express";
import { notificationController } from "./notificationController";
import { validateRequest } from "../../middlewares/validateRequest";
import { createNotificationSchema, createNotificationForMultiUserSchema } from "./dto/notificationSchema";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
const notificationRoute = Router();

notificationRoute.post("/create-notification", authMiddleware, roleMiddleware("SUPERADMIN", "ADMIN"), validateRequest(createNotificationSchema), notificationController.createNotification);
notificationRoute.post("/create-notification-for-multi-user", authMiddleware, roleMiddleware("SUPERADMIN", "ADMIN"), validateRequest(createNotificationForMultiUserSchema), notificationController.createNotificationForMultiUser);
notificationRoute.get("/get-notification", authMiddleware,roleMiddleware("SUPERADMIN", "ADMIN", "USER"), notificationController.getMyNotifications);
notificationRoute.get("/:id/read", authMiddleware, notificationController.markAsRead);
notificationRoute.get("/read-all", authMiddleware, notificationController.markAllAsRead);

export default notificationRoute;