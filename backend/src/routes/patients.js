import express from 'express';
import { getAllPatients, createPatient } from '../controllers/admin/patientController.js';

const router = express.Router();

router.get('/', getAllPatients);
router.post('/', createPatient);

export default router;
