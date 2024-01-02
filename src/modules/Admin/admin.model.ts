import { HydratedDocument, Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Admin {
  name: string;
  email: string;
  password: string;
  publicKey?: string;
  role: string;
  createJWT: (publicKey: string) => string;
  comparePasswords: (candidatePassword: String) => Promise<boolean>;
}

export interface AdminDocument extends Admin, Document {}

const AdminSchema = new Schema<AdminDocument>(
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
    publicKey: {
      type: String,
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  { timestamps: true }
);

export type AdminModel = Model<AdminDocument>;

AdminSchema.pre('save', async function (next) {
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

AdminSchema.methods.createJWT = function (
  this: AdminDocument,
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

AdminSchema.methods.comparePasswords = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as AdminDocument;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
};

const Admin = model<AdminDocument, AdminModel>('Admin', AdminSchema);

export default Admin;
