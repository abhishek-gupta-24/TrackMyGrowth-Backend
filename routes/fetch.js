import express from 'express';
import {
  getUserInfo,
  getPersonalInfo,
  getPlatformInfo,
  getSocialInfo,
} from '../Controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/userinfo/:email', authenticateToken, getUserInfo);
router.get('/getPersonalInfo/:email', authenticateToken, getPersonalInfo);
router.get('/getPlatformInfo/:email', authenticateToken, getPlatformInfo);
router.get('/getSocialInfo/:email', authenticateToken, getSocialInfo);

export default router;