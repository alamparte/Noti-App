import { Router } from 'express';
import {
    register,
    login,
    getDataRegister,
    getDataLogin,
    logout,
    checkuser,
    forgotPasswordForm,
    forgotPassword,
    changePasswordForm,
    changePassword,
    checkEmail,
    checkCode,
    checkEmailCode,
} from '../controllers/usersController.js';
import { checkNoAuth } from '../middleware/auth.js';

const router = Router();
// check username
router.get('/signed_in', checkuser);
// register route
router.get('/register', checkNoAuth, register);
router.post('/register', getDataRegister);
// login route
router.get('/login', checkNoAuth, login);
router.post('/login', getDataLogin);
// forgot password route
router.get('/forgot-password', checkNoAuth, forgotPasswordForm);
router.post('/check-email', checkEmail);
router.get('/checkEmailCode', checkEmailCode);
router.post('/check-code', checkCode);
router.patch('/forgot-password', forgotPassword);
// change password route
router.get('/dashboard/change-password', changePasswordForm);
router.patch('/dashboard/change-password', changePassword);
// logout route
router.get('/dashboard/logout', logout);


export { router };
