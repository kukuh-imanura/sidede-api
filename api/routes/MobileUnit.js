import express from 'express';
import { getAll, get, post, patch, del } from '../controllers/MobileUnit.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', get);
router.post('/', post);
router.patch('/:id', patch);
router.delete('/:id', del);

export default router;
