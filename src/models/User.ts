import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  resetPasswordOTP?: string;     
  resetPasswordExpires?: number;  
}

const UserSchema: Schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],  
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordOTP: String,
  resetPasswordExpires: Number,
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
