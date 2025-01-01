import express from 'express';
import { getAll, get, post, patch, del, auth } from '../controllers/HakAkses.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', get);
router.post('/', post);
router.patch('/:id', patch);
router.delete('/:id', del);

router.post('/auth', auth);

export default router;
