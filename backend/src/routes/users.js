import express from 'express';
import { getAllUsers, createUser, deleteUser, updateUserStatus, bulkImportUsers } from '../controllers/admin/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/bulk', bulkImportUsers);
router.delete('/:id', deleteUser);
router.put('/:id/status', updateUserStatus);

export default router;
