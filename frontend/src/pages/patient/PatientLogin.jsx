import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaLock, FaClinicMedical } from 'react-icons/fa';

const PatientLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e, demoEmail, demoPassword) => {
        if (e) e.preventDefault();
        setLoading(true);

        const loginEmail = demoEmail || email;
        const loginPassword = demoPassword || password;

        try {
            // Simplified for demonstration - assuming real backend exists but providing a fallback for testing
            if (loginEmail === 'patient@example.com' && loginPassword === 'patient123') {
                const demoUser = {
                    id: 'pt101',
                    name: 'John Patient',
                    email: 'patient@example.com',
                    role: 'patient',
                    phone: '123-456-7890',
                    address: '123 Health St, Wellness City'
                };
                localStorage.setItem('token', 'demo-patient-token');
                localStorage.setItem('user', JSON.stringify(demoUser));
                toast.success('Login Successful!');
                navigate('/patient/dashboard');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/patient/login', {
                email: loginEmail,
                password: loginPassword,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Login Successful!');
                navigate('/patient/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        const demoEmail = 'patient@example.com';
        const demoPassword = 'patient123';
        setEmail(demoEmail);
        setPassword(demoPassword);
        handleLogin(null, demoEmail, demoPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-content max-w-md">
                <div className="flex justify-center">
                    <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                        <FaClinicMedical className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Patient Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Welcome back to Community Clinic
                </p>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center justify-center gap-1 mx-auto"
                    >
                        ← Back to Portal Selection
                    </button>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="patient@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>


                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="w-full flex justify-center py-2 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4"
                        >
                            Use Demo Patient Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
