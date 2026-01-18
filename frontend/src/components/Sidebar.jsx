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
  FaStethoscope,
  FaClipboardList,
  FaUserInjured
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

  // 🔹 ADMIN MENU
  const adminMenu = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/doctors', label: 'Doctor Management', icon: <FaUserMd /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/admin/inventory', label: 'Inventory', icon: <FaPills /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  // 🔹 PHARMACIST MENU
  const pharmacistMenu = [
    { path: '/pharmacist/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/pharmacist/inventory', label: 'Inventory Management', icon: <FaBoxes /> },
    { path: '/pharmacist/dispense', label: 'Dispense Medicine', icon: <FaPills /> },
    { path: '/pharmacist/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  // 🔹 DOCTOR MENU
  const doctorMenu = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/doctor/profile', label: 'My Profile', icon: <FaUserCircle /> },
    { path: '/doctor/schedule', label: 'My Schedule', icon: <FaCalendarAlt /> },
    { path: '/doctor/patients', label: 'Patients', icon: <FaUserInjured /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <FaClipboardList /> },
    { path: '/doctor/teleconsult', label: 'Teleconsult', icon: <FaStethoscope /> },
  ];
  
  // 🔹 ReceptionistR MENU
   const receptionistMenu = [
    { path: '/receptionist/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/receptionist/appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
    { path: '/receptionist/patients', label: 'Patients', icon: <FaUserInjured /> },
    { path: '/receptionist/billing', label: 'Billing', icon: <FaMoneyBillWave /> },
  
  ];

  // Get menu based on role
  const getMenuItems = () => {
    switch(role) {
      case 'admin': return adminMenu;
      case 'pharmacist': return pharmacistMenu;
      case 'doctor': return doctorMenu;
      case 'receptionist': return receptionistMenu;
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  // Get portal name based on role
  const getPortalName = () => {
    switch(role) {
      case 'admin': return 'Admin Portal';
      case 'pharmacist': return 'Pharmacy Portal';
      case 'doctor': return 'Doctor Portal';
      case 'receptionist': return 'Receptionist Portal';
      default: return 'Portal';
    }
  };

  // Get welcome message based on role
  const getWelcomeMessage = () => {
    if (!user) return '';
    
    switch(role) {
      case 'admin': 
        return `Welcome, ${user.name || 'Admin'}`;
      case 'pharmacist':
        return `Welcome, ${user.name || 'Pharmacist'}`;
      case 'doctor':
        return `Welcome, ${user.name || 'Doctor'}`;
      case 'receptionist':
        return `Welcome, ${user.name || 'Receptionist'}`;
      default:
        return 'Welcome';
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed flex flex-col shadow-xl">
      
      {/* Logo & User Info */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="font-bold text-lg">
              {user?.name?.charAt(0) || role?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Clinic System</h1>
            <p className="text-sm text-gray-300">
              {getPortalName()}
            </p>
          </div>
        </div>
        
        {/* Welcome Message */}
        <div className="mt-2 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm font-medium">{getWelcomeMessage()}</p>
          {user?.department && (
            <p className="text-xs text-gray-400 mt-1">{user.department}</p>
          )}
          {user?.specialization && (
            <p className="text-xs text-blue-300 mt-1">{user.specialization}</p>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          location.pathname.startsWith(item.path + '/');
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
              }`}
            >
              <span className="text-lg opacity-90">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
        
        {/* Role indicator */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-700 rounded">Role: {role}</span>
            <span className="px-2 py-1 bg-gray-700 rounded">
              ID: {user?.id?.substring(0, 8) || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;