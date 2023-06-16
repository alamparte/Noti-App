import { Router } from 'express';
import {
    renderIndex,
    renderWhy,
    renderNotFound,
} from '../controllers/indexController.js';

const router = Router();
// main Seite
router.get('/', renderIndex);
// Warum noti menu link
router.get('/why-noti', renderWhy);
// 404 Seite
router.get('/page-not-found', renderNotFound);

export { router };
