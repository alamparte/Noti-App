import { Router } from 'express';
import { renderIndex, renderWhy } from '../controllers/indexController.js';
import { checkNoAuth, checkAuth } from '../middleware/auth.js';

const router = Router();
// main Seite
router.get('/', checkNoAuth, renderIndex);
// Warum noti menu link
router.get('/why-noti', renderWhy);

export { router };
