import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 1. Portal Access Page
function PortalAccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl text-white">🏥</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Community Clinic System
          </h1>
          <p className="text-gray-600 text-lg">
            Select your portal to access the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admin Portal */}
          <Link
            to="/login"
            className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center hover:bg-blue-100 hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Admin Portal
            </h3>
            <p className="text-gray-600 mb-6">
              Manage clinic operations and users
            </p>
            <div className="text-blue-600 font-semibold">
              Access Portal →
            </div>
          </Link>

          {/* Doctor Portal (Coming Soon) */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 text-center opacity-60">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Doctor Portal
            </h3>
            <p className="text-gray-600 mb-6">
              View appointments and manage patients
            </p>
            <div className="text-gray-400 font-semibold">
              Coming Soon
            </div>
          </div>

          {/* Pharmacist Portal (Coming Soon) */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 text-center opacity-60">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">💊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Pharmacist Portal
            </h3>
            <p className="text-gray-600 mb-6">
              Manage inventory and prescriptions
            </p>
            <div className="text-gray-400 font-semibold">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Login Page
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple demo login
    const user = {
      id: 1,
      email: email,
      role: 'admin',
      name: 'Admin User'
    };
    
    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-5xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to clinic admin portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="admin@clinic.com"
                  defaultValue="admin@clinic.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter password"
                  defaultValue="password123"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              ← Back to Portal Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Protected Route Component
function ProtectedRoute({ children, role }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const user = userStr ? JSON.parse(userStr) : {};
      if (role && user.role !== role) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  }, [role]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 4. Admin Dashboard
function AdminDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const stats = [
    { title: 'Total Patients', value: '2,847', change: '+12%', color: 'blue' },
    { title: 'Active Doctors', value: '42', change: '+3', color: 'green' },
    { title: "Today's Appointments", value: '156', change: '+8%', color: 'purple' },
    { title: 'Low Stock Items', value: '23', change: '+5', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <Link to="/admin" className="font-medium">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-gray-300">Users</Link>
            <Link to="/admin/doctors" className="hover:text-gray-300">Doctors</Link>
            <Link to="/admin/inventory" className="hover:text-gray-300">Inventory</Link>
            <Link to="/admin/reports" className="hover:text-gray-300">Reports</Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h2>
          <p className="text-gray-600">Here's what's happening with your clinic today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <span className={`text-2xl ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-red-600'
                  }`}>
                    {stat.title.includes('Patients') ? '👥' :
                     stat.title.includes('Doctors') ? '👨‍⚕️' :
                     stat.title.includes('Appointments') ? '📅' : '⚠️'}
                  </span>
                </div>
              </div>
              <p className="text-green-500 text-sm">{stat.change} from last month</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span>👨‍⚕️</span>
                </div>
                <div>
                  <p className="font-medium">Dr. Sarah Wilson completed appointment</p>
                  <p className="text-sm text-gray-600">10:30 AM</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div>
                  <p className="font-medium">New patient registration</p>
                  <p className="text-sm text-gray-600">9:45 AM</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span>💊</span>
                </div>
                <div>
                  <p className="font-medium">Inventory restocked</p>
                  <p className="text-sm text-gray-600">9:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Other Admin Pages (Placeholders)
function UserManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Management</h1>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/admin/users" className="font-medium">Users</Link>
            <Link to="/admin/doctors" className="hover:text-gray-300">Doctors</Link>
            <Link to="/admin/inventory" className="hover:text-gray-300">Inventory</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">User Management</h2>
          <p className="text-gray-600">Manage all users in the system</p>
          
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Role</th>
                    <th className="py-2 px-4 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border">John Smith</td>
                    <td className="py-2 px-4 border">john@example.com</td>
                    <td className="py-2 px-4 border">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Patient
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Dr. Sarah Wilson</td>
                    <td className="py-2 px-4 border">sarah@hospital.com</td>
                    <td className="py-2 px-4 border">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        Doctor
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Doctor Management</h1>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-gray-300">Users</Link>
            <Link to="/admin/doctors" className="font-medium">Doctors</Link>
            <Link to="/admin/inventory" className="hover:text-gray-300">Inventory</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Doctor Management</h2>
          <p className="text-gray-600">Manage doctor profiles and schedules</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p>This page is under development. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-gray-300">Users</Link>
            <Link to="/admin/doctors" className="hover:text-gray-300">Doctors</Link>
            <Link to="/admin/inventory" className="font-medium">Inventory</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
          <p className="text-gray-600">Track and manage medical supplies</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p>This page is under development. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reports() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6 py-3">
            <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-gray-300">Users</Link>
            <Link to="/admin/doctors" className="hover:text-gray-300">Doctors</Link>
            <Link to="/admin/reports" className="font-medium">Reports</Link>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
          <p className="text-gray-600">View system reports and analytics</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p>This page is under development. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Main App Component
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
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;