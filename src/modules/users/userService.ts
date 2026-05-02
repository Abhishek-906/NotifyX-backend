import { AppError } from "../../utils/AppError";
import { User } from "./userModel"

export const userService = {

  getMe: async (userId: string)=>{
      const user = await User.findById(userId).select("-password");
      if(!user){
        throw new AppError("User not presend", 401);
      }
      return user;
  }
}