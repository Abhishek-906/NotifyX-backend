import { Router } from "express";
import { getchildCount, createUser, getChildren } from './userController';
import { validateRequest } from "../../middlewares/validateRequest";
import {childCountSchema, userCreateSchema } from './dto/userSchema';
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

const userRoutes = Router();

 userRoutes.get('/countChild', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), getchildCount );
 userRoutes.post('/createUser', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), validateRequest(userCreateSchema),createUser );
 userRoutes.post('/children', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), getChildren );

 export default userRoutes;