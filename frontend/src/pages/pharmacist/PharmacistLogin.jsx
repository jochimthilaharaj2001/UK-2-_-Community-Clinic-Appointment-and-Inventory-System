import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserMd, FaLock } from 'react-icons/fa';
import api from "../../services/api";

const PharmacistLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh

    // Validate fields before sending API request
    if (!email || !password) {
      setError('Please enter all fields');
      return;
    }

    try {
      const res = await api.post('/pharmacist/login', { email, password });
      const data = res.data;

      // Store token and user correctly
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.pharmacist));

      // Redirect to dashboard
      navigate("/pharmacist/dashboard");

    } catch (error) {
      console.error(error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaUserMd className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Pharmacist Login
          </h2>
          <p className="text-gray-500">
            Access Pharmacy Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-600 block mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaUserMd className="text-gray-400" />
              <input
                type="email"
                placeholder="pharmacist@mail.com"
                className="w-full px-3 py-2 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 block mb-1">Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-3 py-2 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-5">
          <p className="text-gray-500">
            Contact Administrator for Pharmacist Account creation.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-green-600 hover:underline">
            ← Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PharmacistLogin;
