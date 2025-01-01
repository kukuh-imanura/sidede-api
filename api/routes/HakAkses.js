import express from 'express';
import { getAll, get, post, patch, del, auth } from '../controllers/HakAkses.js';

const router = express.Router();

router.post('/auth', auth);

router.get('/', getAll);
router.get('/:id', get);
router.post('/', post);
router.patch('/:id', patch);
router.delete('/:id', del);

export default router;
