import { AppError } from "../../utils/AppError";
import { User } from "./userModel"
import bcrypt from "bcryptjs";

export const userService = {

  getMe: async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError("User not presend", 401);
    }
    return user;
  },
  childCount: async (userId: string) => {

    return await User.countDocuments({ parentId: userId })
  },
  createUser: async (user: any, fullName: string, email: string, password: string) => {
    const loggedInUserRole = user.role;
    let newUserRole;
    console.log("user login", user);

    if (loggedInUserRole === "SUPERADMIN") {
      newUserRole = "ADMIN";
    } else if (loggedInUserRole === "ADMIN") {
      newUserRole = "USER";
    } else {
      throw new AppError("Unauthorized", 403);
    }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      throw new AppError("Email already exists", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      role: newUserRole,
      parentId: user.userId
    });

    const userObj = newUser.toObject();
    const { password:hashedPassword, ...safeUser } = userObj;
    
    return safeUser;
  }
}