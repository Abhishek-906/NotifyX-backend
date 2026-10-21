import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import { auditController } from "./auditController";

const auditRoutes = Router();

auditRoutes.get(
  "/recent",
  authMiddleware,
  roleMiddleware("SUPERADMIN", "ADMIN"),
  auditController.getRecentAudits,
);

export default auditRoutes;
