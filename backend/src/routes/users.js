import express from 'express';
import { getAllUsers, createUser } from '../controllers/admin/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);

export default router;
