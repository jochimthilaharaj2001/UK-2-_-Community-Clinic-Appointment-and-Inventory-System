import express from 'express';
import {
  getPrescriptionById,
  dispenseMedicine
} from '../controllers/Pharmacist/prescriptionController.js';

const router = express.Router();

router.get('/:id', getPrescriptionById);
router.post('/dispense', dispenseMedicine);

export default router;
