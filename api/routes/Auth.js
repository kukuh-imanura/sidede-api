import express from 'express';
import { post } from '../controllers/Auth.js';

const router = express.Router();

router.post('/', post);

export default router;
