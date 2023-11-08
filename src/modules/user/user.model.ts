import { HydratedDocument, Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      email: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export type UserDocument = HydratedDocument<typeof UserSchema>;

const User = model<UserDocument>('User', UserSchema);

export default User;
