import { asyncHandler } from "../../utils/asyncHandler";
import { userService } from "./userService";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { childCountSchema } from './dto/userSchema'

export const getchildCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
   console.log("useId www contoller", userId);

    const validateData = childCountSchema.parse({
        userId
    })
    const userCounts = await userService.childCount(validateData.userId);
    return sendResponse(res, 200, true, "Users Count successfully", userCounts)
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = ( req as any).user ;
    const { fullName, email, password } = req.body ;
    const newUser = await userService.createUser(user, fullName, email, password);
    return sendResponse(res, 201, true, "Users Created successfully",newUser);
})