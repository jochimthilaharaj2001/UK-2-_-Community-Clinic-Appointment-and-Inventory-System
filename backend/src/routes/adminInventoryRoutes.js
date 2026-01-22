import express from 'express';
import {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
} from '../controllers/admin/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', addInventoryItem);
router.put('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);

export default router;
