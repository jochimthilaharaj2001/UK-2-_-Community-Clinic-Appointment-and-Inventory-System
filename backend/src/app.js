
import express from 'express';
import cors from 'cors';

// Import middleware
import { authenticateToken, authorizeRole } from './middleware/authMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes with role-based access
app.use('/api/admin', authenticateToken, authorizeRole('admin'), adminRoutes);
app.use('/api/doctor', authenticateToken, authorizeRole('doctor'), doctorRoutes);
app.use('/api/patient', patientRoutes); // Patient login is public, other routes will be protected
app.use('/api/receptionist', authenticateToken, authorizeRole('receptionist'), receptionistRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/prescriptions', authenticateToken, prescriptionRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

app.get('/', (req, res) => {
  res.send('Clinic Management Backend API is running');
});

export default app;
