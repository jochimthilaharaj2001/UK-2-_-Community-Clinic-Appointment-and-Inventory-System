import express from 'express';
import cors from 'cors';

import pharmacistRoutes from './routes/pharmacistRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/pharmacist', pharmacistRoutes);
app.use('/api/pharmacist/inventory', inventoryRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Clinic Management Backend API is running');
});


export default app;
