import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const roleMiddleware = (...roles:string[])=>(req:Request, res:Response, next:NextFunction)=>{
     const role = (req as any).user?.role;
     console.log("user role in role middlwaw", role);
     if(!roles.includes(role)){
      return next( new AppError("Not allowed", 403));
     }
     next();
}