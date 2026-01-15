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

import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import DispenseMedicine from './pages/pharmacist/DispenseMedicine';
import PharmacistInventoryManagement from './pages/pharmacist/InventoryManagement';
import PharmacistReports from './pages/pharmacist/Reports';
import PharmacistLogin from './pages/pharmacist/PharmacistLogin.jsx';
import PatientLayout from './components/PatientLayout';
import Dashboard from './pages/patient/Dashboard';
import DoctorSearch from './pages/patient/DoctorSearch';
import AppointmentForm from './pages/patient/AppointmentForm';
import Profile from './pages/patient/Profile';
import ChangePassword from './pages/patient/ChangePassword';
import DoctorProfile from './pages/patient/DoctorProfile';
import MyAppointments from './pages/patient/MyAppointments';
import PatientLogin from './pages/patient/PatientLogin';
import MedicalRecords from './pages/patient/MedicalRecords';
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

        <Route
          path="/pharmacist/login"
          element={<PharmacistLogin />
          }
        />

        <Route path="/patient/login" element={<PatientLogin />} />

        {/* Patient Routes */}
        <Route element={<PatientLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search-doctor" element={<DoctorSearch />} />
          <Route path="/book-appointment" element={<AppointmentForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
        </Route>
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;