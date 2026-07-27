import { asyncHandler } from "../../utils/asyncHandler";
import { userService } from "./userService";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { childCountSchema, getChildrenSchema } from './dto/userSchema'

export const  getchildCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    const validateData = childCountSchema.parse({
        userId
    })
    const userCounts = await userService.childCount(validateData.userId);
    return sendResponse(res, 200, true, "Users Count successfully", userCounts)
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = ( req as any).user ;
    const { fullName, email, password, parentId } = req.body ;
    const newUser = await userService.createUser(user, fullName, email, password, parentId);
    return sendResponse(res, 201, true, "Users Created successfully",newUser);
})

export const getChildren = asyncHandler(async (req: Request, res: Response)=>{
    const currentUser = ( req as any).user;
    const query = (req as any).validated;
    const children = await userService.getChildren( currentUser, query );
     return sendResponse(res, 201, true, "Children list fetch successfully", children );
})


export const getChildren = asyncHandler(async (req: Request, res: Response) => {
    const page = ( req as any).query.page || 1 ;
    const limit = ( req as any).query.limit || 10 ;

    let parentId;
    if(req.query.parentId){
        parentId = req.query.parentId;
    }else{
        parentId = (req as any).user.userId ;
    }
     getChildrenSchema.parse({ parentId, limit , page });

    const getChildren = await userService.getChildren( parentId , limit, page);
    return sendResponse(res, 200, true, "Successfully fetch children list",getChildren);
})