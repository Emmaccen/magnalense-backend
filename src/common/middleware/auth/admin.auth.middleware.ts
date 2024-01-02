import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import Admin, {AdminDocument} from '../../../modules/Admin/admin.model';
import Unauthenticated from '../../errors/unauthenticated';
import { HttpResponseCodes } from '../../../enums/HttpResponseCodes';

const adminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // cookies or Auth headers???
    const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer')|| !req.cookies.token) {
    //   throw new Unauthenticated('Authentication invalid');
    // }
    // const token = authHeader.split(' ')[1] || req.cookies.token;
    const token =  req.cookies.token;
 
    if (!token) {
      throw new Unauthenticated('Token not found, Retry Login');
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    ) as JwtPayload & {
      userId: string;
      name: string;
      role: string;
      publicKey: string;
    };

    const user: AdminDocument | null = await Admin.findById(payload.userId);

    if (!user) {
      throw new Unauthenticated('Admin account not found');
    }

    if (user.role !== 'admin') {
      throw new Unauthenticated('Access denied, login as an admin');
    }
    if (payload.publicKey !== user.publicKey) {
      throw new Unauthenticated('Invalid public key, retry login');
    }
    
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error: any) {
    next(res.status(HttpResponseCodes.UNAUTHORIZED).json(error.message || 'Authentication failed'));
  } 
   
};

export default adminAuthMiddleware;
