import express from 'express';
import {
    getFinancialStats,
    getPatientStats,
    getAppointmentStats,
    getInventoryStats
} from '../controllers/admin/reportController.js';

const router = express.Router();

router.get('/financial', getFinancialStats);
router.get('/patients', getPatientStats);
router.get('/appointments', getAppointmentStats);
router.get('/inventory', getInventoryStats);

export default router;
