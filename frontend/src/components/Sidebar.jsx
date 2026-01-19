import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaUserMd,
  FaCalendarAlt,
  FaPills,
  FaChartBar,
  FaSignOutAlt,
  FaBoxes,
  FaClipboardList,
  FaUserInjured,
  FaUserCircle,
  FaMoneyBillWave
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // ADMIN MENU
  const adminMenu = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/doctors', label: 'Doctor Management', icon: <FaUserMd /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/admin/inventory', label: 'Inventory', icon: <FaPills /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  // PHARMACIST MENU
  const pharmacistMenu = [
    { path: '/pharmacist/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/pharmacist/inventory', label: 'Inventory', icon: <FaBoxes /> },
    { path: '/pharmacist/dispense', label: 'Dispense Medicine', icon: <FaPills /> },
    { path: '/pharmacist/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  // DOCTOR MENU
  const doctorMenu = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/doctor/profile', label: 'My Profile', icon: <FaUserCircle /> },
    { path: '/doctor/schedule', label: 'My Schedule', icon: <FaCalendarAlt /> },
    { path: '/doctor/patients', label: 'Patients', icon: <FaUserInjured /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <FaClipboardList /> },
  ];

  // RECEPTIONIST MENU (matches App.jsx)
  const receptionistMenu = [
    { path: '/receptionist/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/receptionist/profile', label: 'Receptionist Desk', icon: <FaUserCircle /> },
    { path: '/receptionist/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/receptionist/patients', label: 'Patients', icon: <FaUserInjured /> },
    { path: '/receptionist/billing', label: 'Billing', icon: <FaMoneyBillWave /> },
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'admin': return adminMenu;
      case 'pharmacist': return pharmacistMenu;
      case 'doctor': return doctorMenu;
      case 'receptionist': return receptionistMenu;
      default: return [];
    }
  };

  const getPortalName = () => {
    switch (role) {
      case 'admin': return 'Admin Portal';
      case 'pharmacist': return 'Pharmacy Portal';
      case 'doctor': return 'Doctor Portal';
      case 'receptionist': return 'Receptionist Portal';
      default: return 'Portal';
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Clinic System</h1>
        <p className="text-sm text-gray-400">{getPortalName()}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {getMenuItems().map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
