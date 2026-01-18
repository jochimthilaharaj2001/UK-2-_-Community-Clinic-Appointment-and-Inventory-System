import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { 
  FaUser, 
  FaLock, 
  FaUserShield, 
  FaUserMd, 
  FaPills, 
  FaUserTie // Add this import
} from 'react-icons/fa';
=======
import { FaUser, FaLock, FaHospital, FaPills, FaUserMd, FaUserShield, FaIdCard } from 'react-icons/fa';
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'admin'; // Default to admin

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfigs = {
    admin: {
      title: 'Admin Login',
      icon: <FaUserShield className="text-5xl text-blue-600" />,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800',
      demoEmail: 'admin@clinic.com',
      demoPassword: 'admin123',
      redirectPath: '/admin',
      description: 'Sign in to clinic admin portal'
    },
    pharmacist: {
      title: 'Pharmacist Login',
      icon: <FaPills className="text-5xl text-purple-600" />,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'from-purple-700 to-purple-800',
      demoEmail: 'pharmacist@clinic.com',
      demoPassword: 'pharma123',
      redirectPath: '/pharmacist/dashboard',
      description: 'Sign in to pharmacy management portal'
    },
    doctor: {
      title: 'Doctor Login',
      icon: <FaUserMd className="text-5xl text-green-600" />,
      color: 'from-green-600 to-green-700',
      hoverColor: 'from-green-700 to-green-800',
      demoEmail: 'doctor@clinic.com',
      demoPassword: 'doctor123',
      redirectPath: '/doctor/dashboard',
      description: 'Sign in to doctor portal'
    },
    receptionist: {
      title: 'Receptionist Login',
<<<<<<< HEAD
      icon: <FaUserTie className="text-5xl text-teal-600" />, // Fixed: Using FaUserTie
      color: 'from-teal-600 to-teal-700',
      hoverColor: 'from-teal-700 to-teal-800',
      demoEmail: 'reception@clinic.com',
      demoPassword: 'reception123',
      redirectPath: '/receptionist/dashboard',
      description: 'Sign in to reception desk portal'
=======
      icon: <FaIdCard className="text-5xl text-amber-600" />,
      color: 'from-amber-600 to-amber-700',
      hoverColor: 'from-amber-700 to-amber-800',
      demoEmail: 'receptionist@clinic.com',
      demoPassword: 'reception123',
      redirectPath: '/receptionist/dashboard',
      description: 'Sign in to receptionist portal'
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
    }
  };

  const config = roleConfigs[role] || roleConfigs.admin;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Mock authentication - In production, this would be an API call
      let authenticated = false;
      let userData = null;

      // Admin credentials
      if (role === 'admin' && formData.email === config.demoEmail && formData.password === config.demoPassword) {
        authenticated = true;
        userData = {
          id: '1',
          email: formData.email,
          role: 'admin',
          name: 'Admin User',
          department: 'Administration'
        };
      }
      // Pharmacist credentials
      else if (role === 'pharmacist' && formData.email === config.demoEmail && formData.password === config.demoPassword) {
        authenticated = true;
        userData = {
          id: '2',
          email: formData.email,
          role: 'pharmacist',
          name: 'John Pharmacist',
          department: 'Pharmacy',
          licenseNumber: 'PHARM12345'
        };
      }
      // Doctor credentials
      else if (role === 'doctor' && formData.email === config.demoEmail && formData.password === config.demoPassword) {
        authenticated = true;
        userData = {
          id: '3',
          email: formData.email,
          role: 'doctor',
          name: 'Dr. Jane Smith',
          department: 'General Medicine',
          specialization: 'General Practitioner'
        };
      }
<<<<<<< HEAD
      // Receptionist credentials - ADD THIS SECTION
=======
      // Receptionist credentials
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
      else if (role === 'receptionist' && formData.email === config.demoEmail && formData.password === config.demoPassword) {
        authenticated = true;
        userData = {
          id: '4',
          email: formData.email,
          role: 'receptionist',
<<<<<<< HEAD
          name: 'Jessica Reception',
          department: 'Front Desk',
          location: 'Main Reception'
=======
          name: 'Sarah Johnson',
          department: 'Reception',
          employeeId: 'REC001'
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
        };
      }

      if (authenticated && userData) {
        // Store authentication data
        localStorage.setItem('token', `demo-token-${role}-${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', role);

        // Redirect based on role
        setTimeout(() => {
          navigate(config.redirectPath);
        }, 500);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: config.demoEmail,
      password: config.demoPassword,
    });
    
    // Auto-submit after setting demo credentials
    setTimeout(() => {
      document.getElementById('loginForm').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    }, 100);
  };

  const switchRole = (newRole) => {
    navigate(`/login?role=${newRole}`);
    setFormData({ email: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
            {config.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-600 mt-2">{config.description}</p>
        </div>

<<<<<<< HEAD
        {/* Role Selector - Add Receptionist Button */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
=======
        {/* Role Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-2 rounded-lg transition ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Admin
          </button>
          <button
            onClick={() => switchRole('pharmacist')}
            className={`px-3 py-2 rounded-lg transition ${role === 'pharmacist' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Pharmacist
          </button>
          <button
            onClick={() => switchRole('doctor')}
            className={`px-3 py-2 rounded-lg transition ${role === 'doctor' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Doctor
          </button>
          <button
            onClick={() => switchRole('receptionist')}
<<<<<<< HEAD
            className={`px-3 py-2 rounded-lg transition ${role === 'receptionist' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
=======
            className={`px-4 py-2 rounded-lg transition ${role === 'receptionist' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
          >
            Receptionist
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={`Enter ${role} email`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r ${config.color} text-white font-semibold rounded-lg hover:bg-gradient-to-r ${config.hoverColor} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              Use Demo {role.charAt(0).toUpperCase() + role.slice(1)} Account
            </button>
            <p className="text-center text-gray-600 text-sm mt-2">
              Email: {config.demoEmail} | Password: {config.demoPassword}
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Need to access a different portal?</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => switchRole('admin')}
                className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm"
              >
                Admin Portal
              </button>
              <button
                onClick={() => switchRole('pharmacist')}
                className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm"
              >
                Pharmacy Portal
              </button>
              <button
                onClick={() => switchRole('doctor')}
                className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm"
              >
                Doctor Portal
              </button>
              <button
                onClick={() => switchRole('receptionist')}
                className="px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-sm"
              >
                Receptionist Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;