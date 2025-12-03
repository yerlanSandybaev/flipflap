import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  interest: string;
  mood: string;
  profession: string;
  avatarUrl?: string;
  avatarPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    interest: {
      type: String,
      default: '',
    },
    mood: {
      type: String,
      default: '',
    },
    profession: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    avatarPrompt: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
