import { Router } from 'express';
import { validateRequest } from '../../common/middleware';
import { login, register,logout, viewAllUsers, toggleSuspension, getSingleUser } from './admin.controller';
import adminAuthMiddleware from '../../common/middleware/auth/admin.auth.middleware';

const router = Router();

 
router.post('/register', register);
router.post('/login', login);
router.get('/logout',adminAuthMiddleware, logout);
router.get('/view-users',adminAuthMiddleware, viewAllUsers);
router.get('/view-single-user/:userId',adminAuthMiddleware, getSingleUser);
router.patch("/suspend-user/:userId", adminAuthMiddleware, toggleSuspension);


export const adminController = router;
