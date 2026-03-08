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
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentRole = queryParams.get('role') || 'admin';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfigs = {
    admin: {
      title: 'Admin Login',
      demoEmail: 'admin@clinic.com',
      demoPassword: 'admin123',
      redirectPath: '/admin',
      description: 'Sign in to clinic admin portal'
    },
    doctor: {
      title: 'Doctor Login',
      demoEmail: 'doctor@clinic.com',
      demoPassword: 'doctor123',
      redirectPath: '/doctor/dashboard',
      description: 'Sign in to doctor portal'
    },
    receptionist: {
      title: 'Receptionist Login',
      demoEmail: 'reception@clinic.com',
      demoPassword: 'reception123',
      redirectPath: '/receptionist/dashboard',
      description: 'Sign in to reception desk portal'
    },
    pharmacist: {
      title: 'Pharmacist Login',
      demoEmail: 'pharmacist@clinic.com',
      demoPassword: 'pharma123',
      redirectPath: '/pharmacist/dashboard',
      description: 'Sign in to pharmacy management portal'
    },
    patient: {
      title: 'Patient Login',
      demoEmail: 'patient@clinic.com',
      demoPassword: 'password123',
      redirectPath: '/patient/dashboard',
      description: 'Sign in to access your health records and appointments'
    }
  };

  const config = roleConfigs[currentRole] || roleConfigs.admin;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const performLogin = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
        role: currentRole
      });

      const { token, user, role: userRole } = response.data;
      const userWithRole = { ...user, role: userRole };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      localStorage.setItem('role', userRole);

      navigate(config.redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(formData.email, formData.password);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: config.demoEmail,
      password: config.demoPassword,
    });
    performLogin(config.demoEmail, config.demoPassword);
  };

  const switchRole = (newRole) => {
    navigate(`/?role=${newRole}`);
    setFormData({ email: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4 font-sans select-none">
      <div className="max-w-xl w-full flex flex-col items-center">

        {/* Top Icon Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
          <div className="bg-[#EEF2FF] p-3 rounded-xl">
            <FaUser className="text-4xl text-[#4F46E5]" />
          </div>
        </div>

        {/* Branding */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Rural Siddha Hospital</h2>
          <p className="text-[#3B82F6] font-bold text-sm tracking-wide">Thellipalai</p>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#111827] mb-2">{config.title}</h1>
          <p className="text-gray-500 text-sm font-medium">
            {config.description}
          </p>
        </div>

        {/* Role Selector Grid - Exactly as image */}
        <div className="w-full flex flex-col items-center gap-2 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {['admin', 'doctor', 'pharmacist', 'receptionist'].map((roleKey) => (
              <button
                key={roleKey}
                onClick={() => switchRole(roleKey)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${currentRole === roleKey
                  ? 'bg-[#4F46E5] text-white shadow-lg'
                  : 'bg-[#E5E7EB] text-gray-600 hover:bg-gray-300'
                  }`}
              >
                {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => switchRole('patient')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${currentRole === 'patient'
              ? 'bg-[#4F46E5] text-white shadow-lg'
              : 'bg-[#E5E7EB] text-gray-600 hover:bg-gray-300'
              }`}
          >
            Patient
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-50 p-10 w-full max-w-[440px]">
          <form onSubmit={handleSubmit} className="space-y-7">

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-12 w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                  placeholder={`Enter ${currentRole} email`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-12 w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 py-3 px-4 rounded-2xl text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#3730A3] text-white font-extrabold rounded-2xl hover:bg-[#312E81] transition-all shadow-md text-base uppercase tracking-wider"
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center">
            <button
              onClick={handleDemoLogin}
              className="w-full py-4 bg-[#10B981] text-white font-extrabold rounded-2xl hover:bg-[#059669] transition-all shadow-md text-base uppercase tracking-wider mb-4"
            >
              Use Demo Account
            </button>
            <p className="text-gray-400 text-[11px] font-bold text-center uppercase tracking-widest leading-loose">
              Email: {config.demoEmail} <span className="mx-1 text-gray-200">|</span> Password: {config.demoPassword}
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-xs font-bold mb-6 tracking-tight">Need to access a different portal?</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => switchRole('admin')} className="px-4 py-2 bg-blue-50 text-[#3B82F6] rounded-xl text-[10px] font-black hover:bg-blue-100 transition-colors uppercase tracking-tight">Admin Portal</button>
              <button onClick={() => switchRole('doctor')} className="px-4 py-2 bg-emerald-50 text-[#10B981] rounded-xl text-[10px] font-black hover:bg-emerald-100 transition-colors uppercase tracking-tight">Doctor Portal</button>
              <button onClick={() => switchRole('pharmacist')} className="px-4 py-2 bg-green-50 text-[#059669] rounded-xl text-[10px] font-black hover:bg-green-100 transition-colors uppercase tracking-tight">Pharmacy Portal</button>
              <button onClick={() => switchRole('receptionist')} className="px-4 py-2 bg-orange-50 text-[#F59E0B] rounded-xl text-[10px] font-black hover:bg-orange-100 transition-colors uppercase tracking-tight">Receptionist Portal</button>
              <button onClick={() => switchRole('patient')} className="px-4 py-2 bg-indigo-50 text-[#6366F1] rounded-xl text-[10px] font-black hover:bg-indigo-100 transition-colors uppercase tracking-tight">Patient Portal</button>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-gray-400/60 text-[10px] font-bold tracking-[0.2em] uppercase">
          Rural Siddha Hospital Management System &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default Login;
