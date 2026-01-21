import express from 'express';
import { getReceptionistStats } from '../controllers/receptionist/dashboardController.js';
import { searchPatients, registerPatient } from '../controllers/receptionist/patientController.js';
import { bookAppointment, checkInPatient } from '../controllers/receptionist/appointmentController.js';
import { getInvoices, createInvoice, processPayment } from '../controllers/receptionist/billingController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', getReceptionistStats);

// Patients
router.get('/patients/search', searchPatients);
router.post('/patients', registerPatient);

// Appointments
router.post('/appointments', bookAppointment);
router.put('/appointments/:id/check-in', checkInPatient);
// Note: Frontend BookAppointment uses /receptionist/calendar. We might need a getAppointments route too.
// Adding generic get appointments for receptionist calendar
// router.get('/appointments', ...);

// Billing
router.get('/billing', getInvoices);
router.post('/billing', createInvoice);
router.post('/billing/:id/pay', processPayment);

export default router;
