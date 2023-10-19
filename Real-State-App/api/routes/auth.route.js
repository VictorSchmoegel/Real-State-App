import express from 'express';
import { singup, singin, google } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/singup', singup);
router.post('/singin', singin);
router.post('/google', google);

export default router;