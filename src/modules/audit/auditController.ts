import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { sendResponse } from "../../utils/sendResponse";
import { auditService } from "./auditService";

export const auditController = {
  getRecentAudits: asyncHandler(async (req: Request, res: Response) => {
    const currentUser = (req as any).user;
    console.log("userid we are getting", currentUser);

    if (!currentUser?.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const actorUserId = currentUser.userId;

    const audits = await auditService.getRecentAudits(actorUserId);

    return sendResponse(
      res,
      200,
      true,
      "Recent audit activity fetched successfully",
      audits,
    );
  }),
};
