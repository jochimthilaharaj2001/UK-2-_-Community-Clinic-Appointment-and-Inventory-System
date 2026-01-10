import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import PortalAccess from './pages/PortalAccess';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import Reports from './pages/admin/Reports';
import AppointmentManagement from './pages/admin/AppointmentManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PortalAccess />} />
        <Route path="/login" element={<Login />} />
        
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
        
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />


      </Routes>
    </Router>
  );
}

export default App;