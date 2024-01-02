import { Request, Response } from 'express';
import User from './user.model';

export async function checkUserHandler(req: Request, res: Response) {
  try {
    const { type, value } = req.query;
 
    const user = await User.findOne({ type, value });

    if (!user) {
      return res.notFound('User not found');
    }

    return res.success('User found', { type, value });
  } catch (error: any) {
    return res.internalServer('Error', error);
  }
}