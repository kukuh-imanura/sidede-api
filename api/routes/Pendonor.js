import express from 'express';
import { getAll, get, post, patch, del } from '../controllers/Pendonor.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:nik', get);
router.post('/', post);
router.patch('/:nik', patch);
router.delete('/:nik', del);

export default router;
