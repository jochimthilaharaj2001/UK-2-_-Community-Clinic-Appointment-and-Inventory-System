import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaSignOutAlt, FaUser, FaHome, FaSearch, FaCalendarAlt, FaFilePrescription } from 'react-icons/fa';

const PatientLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any auth tokens if needed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Hospital Logo/Name */}
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <FaHospital className="text-white text-xl" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                                    Community Clinic
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <FaHome /> Dashboard
                            </Link>
                            <Link to="/search-doctor" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <FaSearch /> Find Doctor
                            </Link>
                            <Link to="/book-appointment" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <FaCalendarAlt /> Book Now
                            </Link>
                            <Link to="/my-appointments" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <FaCalendarAlt /> My Appointments
                            </Link>
                            <Link to="/medical-records" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <FaFilePrescription /> Medical Records
                            </Link>
                            <Link to="/profile" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <FaUser /> Profile
                            </Link>
                        </nav>

                        {/* Logout Button */}
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 border border-red-200"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Community Clinic. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PatientLayout;
