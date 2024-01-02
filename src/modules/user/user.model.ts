import { HydratedDocument, Schema, model, Document, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface User {
  name: string;
  email: string;
  password: string;
  isSuspended: boolean;
  publicKey?: string;
  role: string;
  cart:Types.ObjectId,
  createJWT: (publicKey: string) => string;
  comparePasswords: (candidatePassword: String) => Promise<boolean>;
}

export interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a Name'],
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide an Email'],
      trim: true,
      email: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    publicKey: {
      type: String,
    },
    cart:[
      {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true }
);

export type UserModel = Model<UserDocument>;

UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.createJWT = function (
  this: UserDocument,
  publicKey?: string
): string {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      email: this.email,
      publicKey,
      role: this.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '2d' }
  );
};

UserSchema.methods.comparePasswords = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
};

const User = model<UserDocument, UserModel>('User', UserSchema);

export default User;
