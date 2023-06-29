import { Router } from 'express';
import { register, login, getDataRegister, getDataLogin, logout, checkuser, changePasswordForm, changePassword, checkEmail } from '../controllers/usersController.js';
import { checkNoAuth } from '../middleware/auth.js';

const router = Router();

router.get('/register', checkNoAuth, register);
router.get('/login', checkNoAuth, login);
router.get('/change-password', checkNoAuth, changePasswordForm);

router.post('/register', getDataRegister);
router.post('/login', getDataLogin);
router.post('/check-email', checkEmail);
router.post('/change-password', changePassword);

router.get('/dashboard/logout', logout);

// checkuser
router.get('/signed_in', checkuser);

export { router };
