import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaHospital, FaArrowLeft } from 'react-icons/fa';

const PatientLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const demoUser = {
                id: 'p1',
                name: 'John Doe',
                email: formData.email,
                role: 'patient',
            };
            localStorage.setItem('token', 'demo-patient-token');
            localStorage.setItem('user', JSON.stringify(demoUser));
            setLoading(false);
            navigate('/dashboard');
        }, 1000);
    };

    const handleDemoLogin = () => {
        setFormData({
            email: 'patient@clinic.com',
            password: 'password123',
        });

        // Trigger submit after a short delay for visual effect
        setTimeout(() => {
            const demoUser = {
                id: 'p1',
                name: 'John Doe',
                email: 'patient@clinic.com',
                role: 'patient',
            };
            localStorage.setItem('token', 'demo-patient-token');
            localStorage.setItem('user', JSON.stringify(demoUser));
            navigate('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                            <FaArrowLeft className="mr-2" /> Back to Home
                        </Link>
                        <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                            <FaHospital />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Patient Login</h2>
                        <p className="text-gray-600 mt-2">Welcome back to Community Clinic</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaUser />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">For Testing Purpose</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDemoLogin}
                            className="mt-4 w-full bg-green-50 text-green-700 font-semibold py-3 px-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
                        >
                            One-Click Demo Login
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientLogin;
