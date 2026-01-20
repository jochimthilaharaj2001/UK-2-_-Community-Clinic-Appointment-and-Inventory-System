import express from 'express';
import {
  inventoryReport,
  lowStockReport,
  dispensedReport
} from '../controllers/Pharmacist/reportController.js';

const router = express.Router();

router.get('/inventory', inventoryReport);
router.get('/low-stock', lowStockReport);
router.get('/dispensed', dispensedReport);

export default router;
