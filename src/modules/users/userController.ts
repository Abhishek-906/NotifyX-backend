import { asyncHandler } from "../../utils/asyncHandler";
import { userService } from "./userService";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";

import { childCountSchema } from './dto/userSchema'

export const getchildCount = asyncHandler(async (req: Request, res: Response) => {
    const { role }= req.params;
    const userId = (req as any).user?.userId;

    console.log("paent id",  userId);
    const validateData = childCountSchema.parse({
        userId,
        role
    })
    const userCounts = await userService.childCount(validateData.userId, validateData.role);
    return sendResponse(res, 200, true, "Users Count successfully", userCounts)
})