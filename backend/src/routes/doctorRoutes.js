import express from 'express';
import { getDoctorStats } from '../controllers/doctor/dashboardController.js';
import { getDoctorProfile, updateDoctorProfile } from '../controllers/doctor/profileController.js';
import { getDoctorPatients, getPatientById } from '../controllers/doctor/patientController.js';
import { getDoctorAppointments, updateAppointmentStatus } from '../controllers/doctor/appointmentController.js';
import { getDoctorPrescriptions, createPrescription } from '../controllers/doctor/prescriptionController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js'; // We need to create this

const router = express.Router();

// Middleware to ensure user is logged in and is a doctor
// For now, assuming we will add middleware.
// router.use(verifyToken);
// router.use(checkRole('doctor'));

// Dashboard
router.get('/dashboard/stats', getDoctorStats);

// Profile
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);

// Patients
router.get('/patients', getDoctorPatients);
router.get('/patients/:id', getPatientById);

// Appointments
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Prescriptions
router.get('/prescriptions', getDoctorPrescriptions);
router.post('/prescriptions', createPrescription);

export default router;
