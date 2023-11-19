import express from 'express';
import { google, signin, signup, signOut } from '../controllers/auth.controller.js';
import { veryfyToken } from '../utils/verifyUser.js';
import { updateUser } from '../controllers/user.controller.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google',google)
router.post('/update/:id', veryfyToken, updateUser)
router.get('/signout',signOut)

export default router;