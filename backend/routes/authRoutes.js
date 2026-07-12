import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { validateLoginInput } from '../validators/authValidator.js';

const router = express.Router();

router.post('/login', validateLoginInput, login);
router.post('/logout', logout);

export default router;
