import express from 'express';
import {
  getInventory,
  addMedicine,
  updateStock,
  deleteMedicine
} from '../controllers/Pharmacist/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.post('/', addMedicine);
router.put('/:id', updateStock);
router.delete('/:id', deleteMedicine);

export default router;
