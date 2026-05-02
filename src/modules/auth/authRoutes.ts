import { Router } from "express";
import { userRegister, loginUser, getMe } from "./authController";
import { registerSchema } from "./dto/registerSchema";
import { loginSchema} from "./dto/loginSchema";
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware"
const authRouter = Router();
  authRouter.post('/register', validateRequest(registerSchema) , userRegister);
  authRouter.post('/login', validateRequest(loginSchema) ,loginUser);
  authRouter.get('/me', authMiddleware, roleMiddleware("SUPERADMIN", "ADMIN") ,getMe);

  export default  authRouter ;