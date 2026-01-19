import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaUserShield,
  FaUserMd,
  FaPills,
  FaUserTie
} from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'admin';

  const [formData, setFormData] = useState({ email: '', password: '' });
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
    },
    pharmacist: {
      title: 'Pharmacist Login',
      icon: <FaPills className="text-5xl text-purple-600" />,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'from-purple-700 to-purple-800',
      demoEmail: 'pharmacist@clinic.com',
      demoPassword: 'pharma123',
      redirectPath: '/pharmacist/dashboard',
    },
    doctor: {
      title: 'Doctor Login',
      icon: <FaUserMd className="text-5xl text-green-600" />,
      color: 'from-green-600 to-green-700',
      hoverColor: 'from-green-700 to-green-800',
      demoEmail: 'doctor@clinic.com',
      demoPassword: 'doctor123',
      redirectPath: '/doctor/dashboard',
    },
    receptionist: {
      title: 'Receptionist Login',
      icon: <FaUserTie className="text-5xl text-teal-600" />,
      color: 'from-teal-600 to-teal-700',
      hoverColor: 'from-teal-700 to-teal-800',
      demoEmail: 'reception@clinic.com',
      demoPassword: 'reception123',
      redirectPath: '/receptionist/dashboard',
    },
  };

  const config = roleConfigs[role];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (
      formData.email === config.demoEmail &&
      formData.password === config.demoPassword
    ) {
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('role', role);
      navigate(config.redirectPath);
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  const switchRole = (newRole) => {
    navigate(`/login?role=${newRole}`);
    setFormData({ email: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          {config.icon}
          <h1 className="text-2xl font-bold mt-4">{config.title}</h1>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {Object.keys(roleConfigs).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-2 rounded-lg ${
                role === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <div className="flex items-center border rounded px-3">
              <FaUser className="text-gray-400" />
              <input
                name="email"
                type="email"
                className="w-full px-2 py-2 outline-none"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="flex items-center border rounded px-3">
              <FaLock className="text-gray-400" />
              <input
                name="password"
                type="password"
                className="w-full px-2 py-2 outline-none"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg bg-gradient-to-r ${config.color}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
