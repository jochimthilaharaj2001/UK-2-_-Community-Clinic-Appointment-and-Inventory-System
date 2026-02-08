import express from 'express';
import {
    getDashboardStats,
    getPatients,
    getPatientById,
    registerPatient,
    updatePatient,
    searchPatients,
    getAppointments,
    bookAppointment,
    updateAppointment,
    deleteAppointment,
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getAvailableDoctors,
    getProfile,
    updateProfile,
    getRecentInvoices
} from '../controllers/receptionistController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-invoices', getRecentInvoices);

// Patient Management
router.get('/patients', getPatients);
router.get('/patients/search', searchPatients);
router.get('/patients/:id', getPatientById);
router.post('/patients', registerPatient);
router.put('/patients/:id', updatePatient);

// Appointment Management
router.get('/appointments', getAppointments);
router.post('/appointments', bookAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

// Billing/Invoices
router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.put('/invoices/:id', updateInvoice);
router.delete('/invoices/:id', deleteInvoice);

// Doctors
router.get('/doctors', getAvailableDoctors);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
