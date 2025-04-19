import express from 'express';
import {
    getatcoderInfo,
    getAtcoderRating,
    getCodechefRating,
    getCodeforcesInfo,
    getCodeforcesRating,
    getgfgInfo,
    getLeetcodeInfo,
    getLeetcodeRating,
} from '../Controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/leetcodeInfo/:email', authenticateToken, getLeetcodeInfo);
router.get('/codeforcesInfo/:email', authenticateToken, getCodeforcesInfo);
router.get('/gfgInfo/:email', authenticateToken, getgfgInfo);
router.get('/atcoderInfo/:email', authenticateToken, getatcoderInfo);
router.get('/leetcodeRating/:email', authenticateToken, getLeetcodeRating);
router.get('/codeforcesRating/:email', authenticateToken, getCodeforcesRating);
router.get('/codechefRating/:email', authenticateToken, getCodechefRating);
router.get('/atcoderRating/:email', authenticateToken, getAtcoderRating);


export default router;