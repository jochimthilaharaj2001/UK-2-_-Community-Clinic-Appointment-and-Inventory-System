import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUsers,
  FaUserMd,
  FaCalendarAlt,
  FaPills,
  FaChartBar,
  FaSignOutAlt,
  FaBoxes
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

  const menuItems = role === 'pharmacist' ? pharmacistMenu : adminMenu;

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed flex flex-col">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Clinic System</h1>
        <p className="text-sm text-gray-400 capitalize">
          {role} Portal
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
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
