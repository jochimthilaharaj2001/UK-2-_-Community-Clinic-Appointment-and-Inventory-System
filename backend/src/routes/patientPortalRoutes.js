import express from 'express';
import patientController from '../controllers/Patient/patientController.js';
import appointmentController from '../controllers/Patient/appointmentController.js';
import doctorController from '../controllers/Patient/doctorController.js';
import notificationController from '../controllers/Patient/notificationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.post('/login', patientController.login);

// Protected (All require login)
router.use(verifyToken);

router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);
router.put('/change-password', patientController.changePassword);
router.get('/dashboard-stats', patientController.getDashboardStats);
router.get('/medical-records', patientController.getMedicalRecords);

router.post('/appointments', appointmentController.bookAppointment);
router.get('/appointments', appointmentController.getPatientAppointments);
router.put('/appointments/:id/cancel', appointmentController.cancelAppointment);

router.get('/doctors', doctorController.getDoctors);

router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

export default router;
