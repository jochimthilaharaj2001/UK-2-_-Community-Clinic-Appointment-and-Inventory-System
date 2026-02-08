import express from 'express';
import {
  getPrescriptions,
  dispenseMedicine
} from '../controllers/Pharmacist/prescriptionController.js';

const router = express.Router();

router.get('/', getPrescriptions);
router.post('/dispense', dispenseMedicine);

export default router;
