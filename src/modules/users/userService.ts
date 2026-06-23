import { AppError } from "../../utils/AppError";
import { User } from "./userModel"

export const userService = {

  getMe: async (userId: string)=>{
      const user = await User.findById(userId).select("-password");
      if(!user){
        throw new AppError("User not presend", 401);
      }
      return user;
  },
  childCount:async(userId:string, role: string)=>{
    console.log("sevice useid", userId);
    console.log("sevice role", role);
    return await User.countDocuments({role, parentId: userId })
  }
}