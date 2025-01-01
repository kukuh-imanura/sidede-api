import express from 'express';
import { count } from '../controllers/Helper.js';

const router = express.Router();

router.get('/count', count);

export default router;
