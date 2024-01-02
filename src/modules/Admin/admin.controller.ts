import { Request, Response, NextFunction } from 'express';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';
import { BadRequest, Unauthenticated } from '../../common/errors/index';
import Admin, { AdminDocument } from './admin.model';
import { generatePublicKey } from '../../common/utils/generatePublicKey';
import User, {UserDocument} from '../user/user.model';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new BadRequest('Please provide name, email, and password');
    }

    // Check for existing users
    const emailAlreadyExists = await Admin.findOne({ email });
    if (emailAlreadyExists) {
      throw new BadRequest('Email already exists');
    }

    const user = await Admin.create({
      name,
      email,
      password,
      role: 'admin',
    });
    const publicKey = generatePublicKey();
    // const token = user.createJWT();
    const token = user.createJWT(publicKey);

    res.cookie('token', token, {
      sameSite: 'none',
      httpOnly: false,
      secure: true,
      expires: new Date(Date.now() + 8 * 3600000),
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(HttpResponseCodes.OK).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        
      },
      token,
    });

    await user.save();
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Unauthenticated('Please provide email and password');
    }

    const user: AdminDocument | null = await Admin.findOne({ email });

    if (!user) {
      throw new Unauthenticated('Admin account does not exist');
    }
    
    const isPasswordCorrect: boolean = await user.comparePasswords(
      password.trim()
    );

    if (!isPasswordCorrect) {
      throw new Unauthenticated('Invalid password');
    }

    const publicKey = generatePublicKey();

    await user.updateOne({ $set: { publicKey } });

    const token: string = user.createJWT(publicKey);

    res.cookie('token', token, {
      sameSite: 'none',
      httpOnly: false,
      secure: true,
      expires: new Date(Date.now() + 8 * 3600000),
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(HttpResponseCodes.OK).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        
      },
      token,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('token', {
      sameSite: 'none',
      httpOnly: false,
      secure: true,
    });

    const userId = req.user?.userId;
    console.log(req.user)
    if (!userId) {
      throw new Unauthenticated('User not authenticated');
    }

    const user: AdminDocument | null = await Admin.findById(userId);

    if (!user) {
      throw new Unauthenticated('User not found');
    }

    await user.updateOne({ $set: { publicKey: null } });

    res.status(HttpResponseCodes.OK).json({ message: 'Logout successful' });
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const viewAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      throw new BadRequest('Only admins can view all users');
    }
    const users = await User.find({}, ' -publicKey -password');

    res.status(HttpResponseCodes.OK).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  try {
    if (req.user?.role !== 'admin') {
      throw new BadRequest('Only admins can view user details');
    }

    const user: UserDocument | null = await User.findById(userId, '-password -publicKey');

    if (!user) {
      throw new BadRequest('User not found');
    }

    res.status(HttpResponseCodes.OK).json({ success: true, user });
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const toggleSuspension = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  try {
    if (req.user?.role !== 'admin') {
      throw new BadRequest('Only admins can suspend/unsuspend users');
    }
 
    const user: UserDocument | null = await User.findById(userId);
 
    if (!user) {
      throw new BadRequest('User not found');
    }
    user.isSuspended = !user.isSuspended;

    await user.updateOne({ $set: { isSuspended: user.isSuspended } });

    const successMessage = user.isSuspended
      ? 'User suspended successfully'
      : 'User unsuspended successfully';

    res.status(HttpResponseCodes.OK).json({ success: true, msg: successMessage });
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};