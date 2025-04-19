import express from 'express';

import {
    updatePlatforms,
    editPersonalInfo,
    updatePersonalInfo,
    editSocialInfo
} from '../Controllers/userController.js';
const router = express.Router();
  
router.put('/platforms/userinfo/:email', authenticateToken, updatePlatforms);
router.put('/editPersonalInfo/:email', authenticateToken, editPersonalInfo);
router.put('/personalInfo/:email', authenticateToken, updatePersonalInfo);
router.put('/editSocialInfo/:email', authenticateToken, editSocialInfo);

export default router;
import { authenticateToken } from '../middleware/auth.js';