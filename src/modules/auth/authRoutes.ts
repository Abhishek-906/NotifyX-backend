import { Router } from "express";
import { userRegister, loginUser } from "./authController";
import { registerSchema } from "./dto/registerSchema";
import { loginSchema} from "./dto/loginSchema";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/authMiddleware";

const authRouter = Router();
  authRouter.post('/register', validateRequest(registerSchema) , userRegister);
  authRouter.post('/login', validateRequest(loginSchema) ,loginUser);

  export default  authRouter ;