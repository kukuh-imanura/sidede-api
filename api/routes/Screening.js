import express from 'express';
import { getAll, get, post, patch, del } from '../controllers/Screening.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', get);
router.post('/', post);
router.patch('/', patch);
router.delete('/:id', del);

export default router;
