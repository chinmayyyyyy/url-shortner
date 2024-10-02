import {RequestHandler , Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.MAIL_API_KEY || "");

  // User Signup
export const signup : RequestHandler = async (req : Request, res : Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ status: false, message: 'User already exists' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

      res.status(201).json({ status: true, message: 'User registered successfully' });
  } catch (error) {
    console.log(error)
      res.status(500).json({ status: false, message: 'Server error ' + error});
  }
};

export const signin :RequestHandler = async (req : Request, res : Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
       res.status(400).json({ status: false, message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ status: false, message: 'Invalid credentials' });
    return;
  }

    const token = jwt.sign({ userId: user._id },"Secret", {
      expiresIn: '1h',
    });

     res.status(200).json({ status: true, token });
  } catch (error) {
      console.log(error)
     res.status(500).json({ status: false, message: 'Server error ' ,error});
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ status: false, message: 'User not found' });
      return;
    }

    const otp = (await generateSixDigitOTP()).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    const msg = {
      to: user.email,
      from: 'chinmay_ghayal_it@moderncoe.edu.in', 
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };

    try {
      await sgMail.send(msg);
      res.status(200).json({ status: true, message: 'OTP sent to email' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ status: false, message: 'Error sending email' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ status: false, message: 'User not found' });
      return;
    }
    if (user.resetPasswordOTP !== otp || user.resetPasswordExpires! < Date.now()) {
      res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = undefined; // Clear OTP after use
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ status: true, message: 'Password reset successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


function generateSixDigitOTP(): number {
  return Math.floor(100000 + Math.random() * 900000);
}