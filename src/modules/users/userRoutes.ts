import { Router } from "express";
import { getchildCount } from './userController';
import { validateRequest } from "../../middlewares/validateRequest";
import {childCountSchema} from './dto/userSchema';
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

const userRoutes = Router();

 userRoutes.get('/countChild/:role', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), getchildCount );

 export default userRoutes;