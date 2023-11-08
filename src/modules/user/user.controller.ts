import { Router } from 'express';
import { validateRequest } from '../../common/middleware';
import { GetUserDto } from './dtos/GetUsersDto';
import { checkUserHandler } from './user.service';

const router = Router();

router.get('/', validateRequest(GetUserDto, 'query'), checkUserHandler);

export const userController = router;
