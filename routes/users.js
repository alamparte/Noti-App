import { Router } from 'express';
import { register, login, getDataRegister, getDataLogin } from '../controllers/usersController.js';

const router = Router();

router.get('/register', register);
router.get('/login', login);

router.post('/register', getDataRegister);
router.post('/login', getDataLogin);

// router.get("/logout", logout);

export { router };
