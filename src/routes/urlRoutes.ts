// src/routes/urlRoutes.ts
import express from 'express';
import { shortenUrl, redirectUrl } from '../controllers/urlController';

const router = express.Router();

// Route to shorten a URL
router.post('/shorten', shortenUrl);

// Route to redirect to the original URL based on the code
router.get('/:urlCode', redirectUrl);

export default router;
