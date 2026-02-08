import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    bulkImportUsers,
    getAllDoctors,
    getAllPatients,
    getAllAppointments,
    getFinancialStats,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from '../controllers/adminController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);
router.post('/users/bulk', bulkImportUsers);

// Doctor Management
router.get('/doctors', getAllDoctors);

// Patient Management
router.get('/patients', getAllPatients);

// Appointment Management
router.get('/appointments', getAllAppointments);
router.post('/appointments', createAppointment);

// Finance Management
router.get('/finance-stats', getFinancialStats);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

export default router;
