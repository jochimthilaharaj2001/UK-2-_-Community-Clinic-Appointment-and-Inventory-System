import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import Reports from './pages/admin/Reports';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import DispenseMedicine from './pages/pharmacist/DispenseMedicine';
import PharmacistInventoryManagement from './pages/pharmacist/InventoryManagement';
import PharmacistReports from './pages/pharmacist/Reports';
import PharmacistLogin from './pages/pharmacist/PharmacistLogin';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pharmacist/login" element={<PharmacistLogin />} />
        
        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/doctors" 
          element={
            <ProtectedRoute role="admin">
              <DoctorManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/appointments" 
          element={
            <ProtectedRoute role="admin">
              <AppointmentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/inventory" 
          element={
            <ProtectedRoute role="admin">
              <InventoryManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          } 
        />

        {/* Pharmacist Protected Routes */}
        <Route 
          path="/pharmacist/dashboard" 
          element={
            <ProtectedRoute role="pharmacist">
              <PharmacistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pharmacist/dispense" 
          element={
            <ProtectedRoute role="pharmacist">
              <DispenseMedicine />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pharmacist/inventory" 
          element={
            <ProtectedRoute role="pharmacist">
              <PharmacistInventoryManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pharmacist/reports" 
          element={
            <ProtectedRoute role="pharmacist">
              <PharmacistReports />
            </ProtectedRoute>
          } 
        />
        
        {/* Doctor Protected Routes */}
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/patients" 
          element={
            <ProtectedRoute role="doctor">
              <DoctorPatients />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/prescriptions" 
          element={
            <ProtectedRoute role="doctor">
              <DoctorPrescriptions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/schedule" 
          element={
            <ProtectedRoute role="doctor">
              <DoctorSchedule />
            </ProtectedRoute>
          } 
        />
        <Route 
         path="/doctor/profile" 
         element={
            <ProtectedRoute role="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;