import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaUserShield,
  FaUserMd,
  FaPills,
  FaUserTie,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import API_BASE_URL from '../services/api';


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
  const [showPassword, setShowPassword] = useState(false);


  const roleConfigs = {
    admin: {
      title: 'Admin Login',
      icon: <FaUserShield className="text-5xl text-blue-600" />,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800',
      demoEmail: 'admin@clinic.com',
      demoPassword: '123456',
      redirectPath: '/admin',
      description: 'Sign in to clinic admin portal'
    },
    pharmacist: {
      title: 'Pharmacist Login',
      icon: <FaPills className="text-5xl text-purple-600" />,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'from-purple-700 to-purple-800',
      demoEmail: 'pharmacist@test.com',
      demoPassword: '123456',
      redirectPath: '/pharmacist/dashboard',
      description: 'Sign in to pharmacy management portal'
    },
    doctor: {
      title: 'Doctor Login',
      icon: <FaUserMd className="text-5xl text-green-600" />,
      color: 'from-[#1a5f35] to-[#124a29]', // Dark Green
      hoverColor: 'from-[#124a29] to-[#0d381f]',
      demoColor: 'bg-[#10b981] hover:bg-[#059669]', // Vibrant Green
      demoEmail: 'sarah@example.com',
      demoPassword: '123456',
      redirectPath: '/doctor/dashboard',
      description: 'Sign in to doctor portal'
    },

    receptionist: {
      title: 'Receptionist Login',
      icon: <FaUserTie className="text-5xl text-teal-600" />,
      color: 'from-teal-600 to-teal-700',
      hoverColor: 'from-teal-700 to-teal-800',
      demoEmail: 'reception@example.com',
      demoPassword: '123456',
      redirectPath: '/receptionist/dashboard',
      description: 'Sign in to reception desk portal'
    },
    patient: {
      title: 'Patient Login',
      icon: <FaUser className="text-5xl text-indigo-600" />,
      color: 'from-indigo-600 to-indigo-700',
      hoverColor: 'from-indigo-700 to-indigo-800',
      demoEmail: 'patient@example.com',
      demoPassword: '123456',
      redirectPath: '/patient/dashboard',
      description: 'Sign in to access your health records and appointments'
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

    try {
      let response;
      let data;

      // Patient Login (Real Backend)
      if (role === 'patient') {
        try {
          response = await fetch(`${API_BASE_URL}/patient/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          data = await response.json();

          if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ ...data.patient, role: 'patient' }));
            localStorage.setItem('role', 'patient');
            navigate('/patient/dashboard');
            return;
          } else {
            setError(data.message || 'Login failed');
            return;
          }
        } catch (err) {
          console.error("Backend connection error", err);
          setError('Connection to server failed. Ensure backend is running.');
          return;
        }
      }

      // Admin, Doctor, Receptionist Login (Real Backend)
      try {
        response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('role', data.user.role);

          // Verify that the logged in role matches the selected portal role
          if (data.user.role !== role) {
            setError(`This account is registered as ${data.user.role}, but you are trying to login to the ${role} portal.`);
            localStorage.clear();
            return;
          }

          navigate(config.redirectPath);
          return;
        } else {
          // USER REQUEST: for doctor login show invalid email and password
          if (role === 'doctor') {
            setError('Invalid email or password');
          } else {
            setError(data.message || 'Login failed');
          }
          return;
        }
      } catch (err) {
        console.error("Backend connection error", err);
        setError('Connection to server failed. Ensure backend is running.');
        return;
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
    setError('');
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
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Rural Siddha Hospital</h1>
            <p className="text-blue-600 font-semibold text-lg">Thellipalai</p>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">{config.title}</h3>
          <p className="text-gray-600 mt-2">{config.description}</p>
        </div>

        {/* Role Selector */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
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
            className={`px-3 py-2 rounded-lg transition ${role === 'receptionist' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Receptionist
          </button>
          <button
            onClick={() => switchRole('patient')}
            className={`px-3 py-2 rounded-lg transition ${role === 'patient' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Patient
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
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
              className={`w-full py-3 px-4 ${config.demoColor || 'bg-green-600 hover:bg-green-700'} text-white font-semibold rounded-lg transition`}
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
              <button
                onClick={() => switchRole('patient')}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-sm"
              >
                Patient Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;