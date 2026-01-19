import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaLock,
  FaUserShield,
  FaUserMd,
  FaPills,
  FaUserTie,
} from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role') || 'admin';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfigs = {
    admin: {
      title: 'Admin Login',
      icon: <FaUserShield className="text-5xl text-blue-600" />,
      color: 'from-blue-600 to-blue-700',
      demoEmail: 'admin@clinic.com',
      demoPassword: 'admin123',
      redirectPath: '/admin',
      description: 'Sign in to clinic admin portal',
    },
    pharmacist: {
      title: 'Pharmacist Login',
      icon: <FaPills className="text-5xl text-purple-600" />,
      color: 'from-purple-600 to-purple-700',
      demoEmail: 'pharmacist@clinic.com',
      demoPassword: 'pharma123',
      redirectPath: '/pharmacist/dashboard',
      description: 'Sign in to pharmacy management portal',
    },
    doctor: {
      title: 'Doctor Login',
      icon: <FaUserMd className="text-5xl text-green-600" />,
      color: 'from-green-600 to-green-700',
      demoEmail: 'doctor@clinic.com',
      demoPassword: 'doctor123',
      redirectPath: '/doctor/dashboard',
      description: 'Sign in to doctor portal',
    },
    receptionist: {
      title: 'Receptionist Login',
      icon: <FaUserTie className="text-5xl text-amber-600" />,
      color: 'from-amber-600 to-amber-700',
      demoEmail: 'receptionist@clinic.com',
      demoPassword: 'reception123',
      redirectPath: '/receptionist/dashboard',
      description: 'Sign in to receptionist portal',
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
      const userData = {
        email: formData.email,
        role,
        name: role.toUpperCase(),
      };

      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', role);

      navigate(config.redirectPath);
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  const switchRole = (r) => {
    navigate(`/login?role=${r}`);
    setFormData({ email: '', password: '' });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mb-4">{config.icon}</div>
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-gray-600">{config.description}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {Object.keys(roleConfigs).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-1 rounded-lg text-sm ${
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
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded bg-gradient-to-r ${config.color}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() =>
            setFormData({
              email: config.demoEmail,
              password: config.demoPassword,
            })
          }
          className="w-full mt-4 bg-green-600 text-white py-2 rounded"
        >
          Use Demo Account
        </button>
      </div>
    </div>
  );
};

export default Login;
