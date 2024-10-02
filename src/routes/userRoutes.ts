import express from 'express';
import { signup, signin, forgotPassword, resetPassword } from '../controllers/userController';
import { validateSignup } from '../utils/validator';
const router = express.Router();

router.post('/signup', validateSignup as any, signup); 
router.post('/signin', signin);
router.post('/forgetPassword', forgotPassword);
router.post('/resetPassword', validateSignup as any, resetPassword);

export default router;
