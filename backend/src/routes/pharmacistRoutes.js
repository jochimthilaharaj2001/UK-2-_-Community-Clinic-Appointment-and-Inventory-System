import express from 'express';
import { loginPharmacist } from '../controllers/Pharmacist/pharmacistController.js';
import {
  getInventory,
  addMedicine,
  updateStock,
  deleteMedicine
} from '../controllers/Pharmacist/inventoryController.js';

const router = express.Router();

router.post('/login', loginPharmacist);

// Inventory routes
router.get('/inventory', getInventory);
router.post('/inventory', addMedicine);
router.put('/inventory/:id', updateStock);
router.delete('/inventory/:id', deleteMedicine);

export default router;
