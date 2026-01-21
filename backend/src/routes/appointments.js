import express from 'express';
import { getAllAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from '../controllers/admin/appointmentController.js';

const router = express.Router();

router.get('/', getAllAppointments);
router.post('/', createAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

export default router;
