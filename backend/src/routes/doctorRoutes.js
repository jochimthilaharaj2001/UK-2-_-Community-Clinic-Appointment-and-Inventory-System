import express from 'express';
import {
    getDashboardStats,
    getPatients,
    getPatientDetails,
    getAppointments,
    updateAppointmentStatus,
    createAppointment,
    getPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription,
    getSchedule,
    updateSchedule,
    getProfile,
    updateProfile,
    registerPatient,
    getPatientMedicalRecords
} from '../controllers/doctorController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Patients
router.get('/patients', getPatients);
router.post('/patients/register', registerPatient);
router.get('/patients/:id', getPatientDetails);
router.get('/patients/:id/records', getPatientMedicalRecords);

// Appointments
router.get('/appointments', getAppointments);
router.post('/appointments', createAppointment);
router.put('/appointments/:id', updateAppointmentStatus);

// Prescriptions
router.get('/prescriptions', getPrescriptions);
router.post('/prescriptions', createPrescription);
router.put('/prescriptions/:id', updatePrescription);
router.delete('/prescriptions/:id', deletePrescription);

// Schedule
router.get('/schedule', getSchedule);
router.put('/schedule', updateSchedule);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
