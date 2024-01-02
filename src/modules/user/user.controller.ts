import { Request, Response, NextFunction } from 'express';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';
import { BadRequest, Unauthenticated } from '../../common/errors/index';
import User, { UserDocument } from './user.model';
import bcrypt from 'bcrypt';
import { generatePublicKey } from '../../common/utils/generatePublicKey';

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
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new BadRequest('Email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
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
        // wishlist: user.wishlist,
        isSuspended: user.isSuspended,
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

    const user: UserDocument | null = await User.findOne({ email });

    if (!user) {
      throw new Unauthenticated('User does not exist');
    }
    if (user.isSuspended) {
      throw new Unauthenticated('You are currently suspended, Please contact the admin');
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
        isSuspended: user.isSuspended,
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
    if (!userId) {
      throw new Unauthenticated('User not authenticated');
    }

    const user: UserDocument | null = await User.findById(userId);

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
