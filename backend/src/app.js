import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import doctorRoutes from './routes/doctors.js';
import patientRoutes from './routes/patients.js';
import userRoutes from './routes/users.js';
import adminInventoryRoutes from './routes/adminInventoryRoutes.js';
import adminReportRoutes from './routes/adminReportRoutes.js';

import pharmacistRoutes from './routes/pharmacistRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
// Doctor Routes
import doctorPanelRoutes from './routes/doctorRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import receptionistRoutes from './routes/receptionistRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Admin & General Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', adminInventoryRoutes); // New Admin Inventory Route
app.use('/api/admin/reports', adminReportRoutes);

// Doctor Specific Routes
app.use('/api/doctor', doctorPanelRoutes);

// Receptionist Routes
app.use('/api/receptionist', receptionistRoutes);

// Pharmacist Routes
app.use('/api/pharmacist', pharmacistRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Clinic Management Backend API is running');
});

export default app;
