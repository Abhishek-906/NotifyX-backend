import { authService } from "./authService";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { userService } from "../users/userService";

export const userRegister =  asyncHandler( async(req: Request, res: Response) => {
    const newUser = await authService.registerUser(req.body);
    return sendResponse(res, 201, true, "User Register successfully", newUser );
});

export const loginUser = asyncHandler( async (req: Request, res: Response) => {
    const loginUser = await authService.loginUser(req.body);
        return sendResponse(res, 200, true, "Login successfully", loginUser );
});

export const getMe = asyncHandler(async (req: Request, res:Response) => {
  console.log("we also reach ehrer")
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const user = await userService.getMe(userId);

  return sendResponse(res, 200, true, "User fetched successfully", user);
});
