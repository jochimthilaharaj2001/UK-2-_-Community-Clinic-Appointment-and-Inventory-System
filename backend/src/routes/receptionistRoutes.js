import express from 'express';
import { getReceptionistStats, getRecentInvoices } from '../controllers/receptionist/dashboardController.js';
import { searchPatients, registerPatient, getAllPatients, getPatientById, updatePatient, deletePatient } from '../controllers/receptionist/patientController.js';
import { bookAppointment, checkInPatient, getTodayAppointments, getAllAppointments, updateAppointmentStatus } from '../controllers/receptionist/appointmentController.js';
import { getInvoices, createInvoice, processPayment } from '../controllers/receptionist/billingController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', getReceptionistStats);
router.get('/dashboard/pending-payments', getRecentInvoices);

// Patients
router.get('/patients', getAllPatients);
router.get('/patients/search', searchPatients);
router.get('/patients/:id', getPatientById);
router.post('/patients', registerPatient);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

// Appointments
router.get('/appointments', getAllAppointments);
router.get('/appointments/today', getTodayAppointments);
router.post('/appointments', bookAppointment);
router.put('/appointments/:id/check-in', checkInPatient);
router.put('/appointments/:id/status', updateAppointmentStatus);
// Note: Frontend BookAppointment uses /receptionist/calendar. We might need a getAppointments route too.
// Adding generic get appointments for receptionist calendar
// router.get('/appointments', ...);

// Billing
router.get('/billing', getInvoices);
router.post('/billing', createInvoice);
router.post('/billing/:id/pay', processPayment);

export default router;
