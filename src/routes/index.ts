import express from 'express';
import userRoutes from './userRoutes';
import urlRoutes from './urlRoutes';
import { redirectUrl } from '../controllers/urlController';

const router = express.Router();

router.use('/api', userRoutes);
router.use('/url', urlRoutes);
router.get('/:urlCode', redirectUrl);


export default router;
