import express from 'express';
import { loginPharmacist } from '../controllers/Pharmacist/pharmacistController.js';

const router = express.Router();

router.post('/login', loginPharmacist);

export default router;
