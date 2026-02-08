import express from 'express';
import {
    getDashboardStats,
    getAppointments,
    bookAppointment,
    cancelAppointment,
    getMedicalRecords,
    getPrescriptions,
    getProfile,
    updateProfile,
    changePassword,
    getNotifications,
    markNotificationRead,
    deleteNotification,
    getAvailableDoctors,
    login
} from '../controllers/patientController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Login (separate endpoint for patient login)
router.post('/login', login);

// Apply authentication to all following patient routes
router.use(authenticateToken);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Appointments
router.get('/appointments', getAppointments);
router.post('/appointments', bookAppointment);
router.put('/appointments/:id/cancel', cancelAppointment);

// Medical Records
router.get('/medical-records', getMedicalRecords);

// Prescriptions
router.get('/prescriptions', getPrescriptions);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);

// Doctors
router.get('/doctors', getAvailableDoctors);

export default router;
