import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { veryfyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';

const router=express.Router();

router.get('/test', test);
router.delete('/delete/:id', veryfyToken, deleteUser)

export default router; 