import { authService } from "./authService";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const userRegister =  asyncHandler( async(req: Request, res: Response) => {
    const newUser = await authService.registerUser(req.body);
    return sendResponse(res, 201, true, "User Register successfully", newUser );
});

export const loginUser = asyncHandler( async (req: Request, res: Response) => {
    const loginUser = await authService.loginUser(req.body);
        return sendResponse(res, 200, true, "Login successfully", loginUser );
});
