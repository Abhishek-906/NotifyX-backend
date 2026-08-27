import { Router } from "express";
import { getchildCount, createUser, getChildren, blockUser } from './userController';
import { validateRequest } from "../../middlewares/validateRequest";
import {childCountSchema, userCreateSchema,getChildrenSchema, blockUserSchema } from './dto/userSchema';
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";

const userRoutes = Router();

 userRoutes.get('/countChild', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), getchildCount );
 userRoutes.post('/createUser', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), validateRequest(userCreateSchema),createUser );
 userRoutes.get('/getChildren', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), validateRequest(getChildrenSchema, "query"),getChildren );
 userRoutes.get('/blockUser/:userId', authMiddleware, roleMiddleware('ADMIN', 'SUPERADMIN'), validateRequest(getChildrenSchema, "query"), blockUser );

 export default userRoutes;