import { Router } from 'express';
import { validateRequest } from '../../common/middleware';
import { GetUserDto } from './dtos/GetUsersDto';
import { checkUserHandler } from './user.service';
import { login, register,logout } from './user.controller';
import userAuthMiddleware from '../../common/middleware/auth/user.auth.middleware';

const router = Router();

// router.get('/', validateRequest(GetUserDto, 'query'), checkUserHandler);
router.post('/register', register);
router.post('/login', login);
router.get('/logout',userAuthMiddleware, logout);
 

export const userController = router;
