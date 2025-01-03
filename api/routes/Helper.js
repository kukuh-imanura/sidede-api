import express from 'express';
import { count, status } from '../controllers/Helper.js';

const router = express.Router();

router.get('/count', count);
router.get('/status', status);

export default router;
