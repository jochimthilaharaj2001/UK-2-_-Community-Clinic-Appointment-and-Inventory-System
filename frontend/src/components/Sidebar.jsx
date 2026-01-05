<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ title, links, doctorName, doctorRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col min-h-screen p-4">
      {/* Top: Name & Role */}
      <div className="p-6 bg-blue-800 text-center rounded mb-6">
        <h2 className="text-xl font-semibold">{doctorName}</h2>
        <p className="text-sm opacity-80">{doctorRole}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`flex items-center w-full text-left py-2 px-3 mb-1 rounded transition ${
                isActive ? "bg-blue-600 border-l-4 border-blue-300" : "hover:bg-blue-600"
              }`}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        className="mt-6 bg-red-600 w-full py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}
=======
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaUserMd, 
  FaCalendarAlt, 
  FaPills, 
  FaChartBar,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaHome /> },
    { path: '/admin/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/doctors', label: 'Doctor Management', icon: <FaUserMd /> },
    { path: '/admin/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/admin/inventory', label: 'Inventory', icon: <FaPills /> },
    { path: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FaUserMd className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Clinic System</h1>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
>>>>>>> cf080b707a51ee05c8aff4d91222845aa4dccc09
