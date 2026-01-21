import express from 'express';
import { getAllDoctors, createDoctor, getDoctorById, updateDoctor, deleteDoctor } from '../controllers/admin/doctorController.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.post('/', createDoctor);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;
