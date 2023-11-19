import express from 'express';
import { google, signin, signup } from '../controllers/auth.controller.js';
import { veryfyToken } from '../utils/verifyUser.js';
import { updateUser } from '../controllers/user.controller.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google',google)
router.post('/update/:id', veryfyToken, updateUser)

export default router;