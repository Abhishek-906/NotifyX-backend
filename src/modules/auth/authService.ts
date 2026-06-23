import { User } from "../users/userModel";
import bcrypt from "bcryptjs";
import { registerSchema } from "./dto/registerSchema";
import { loginSchema } from "./dto/loginSchema";
import { z } from "zod";
import { AppError } from "../../utils/AppError";
import jwt from "jsonwebtoken";
import { nextTick } from "node:process";

type RegisterUserInput = z.infer<typeof registerSchema>;
type LoginUserInput = z.infer<typeof loginSchema>;

export const authService = {
  registerUser: async (data: RegisterUserInput) => {
    const { fullName, email, password } = data;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      throw new AppError("Email already in use", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return newUser;
  },

  loginUser: async (data: LoginUserInput) => {
    const { email, password } = data;

    const existUser = await User.findOne({ email });

    if (!existUser) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(password, existUser.password);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const userObj = existUser.toObject();
    delete (userObj as any).password;

    const payload = {
      userId: existUser._id,
      role: existUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return { user: userObj, token };
  },

  getUserById: async (data: string ) =>{
        const user = await User.findById(data);
        if(!user){
          new AppError("User not present", 401);
        }
        return user ;
  }
};
