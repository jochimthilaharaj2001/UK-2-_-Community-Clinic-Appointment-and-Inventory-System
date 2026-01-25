import express from 'express';
import { getAllInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../controllers/admin/inventoryController.js';

const router = express.Router();

router.get('/', getAllInventory);
router.post('/', createInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
