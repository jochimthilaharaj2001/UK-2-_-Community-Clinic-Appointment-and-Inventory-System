import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaPrescriptionBottleAlt, FaBell, FaNotesMedical, FaClock, FaChevronRight } from 'react-icons/fa';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Mock Notification Data
    const notifications = [
        { id: 1, message: 'Your appointment with Dr. Alice Smith is confirmed for Jan 20.', type: 'info', time: '2 hours ago' },
        { id: 2, message: 'Time to refill your prescription for Amoxicillin.', type: 'warning', time: '1 day ago' },
    ];

    // Mock Upcoming Appointment
    const nextAppointment = {
        doctor: 'Dr. Alice Smith',
        specialty: 'Cardiologist',
        date: 'Jan 20, 2025',
        time: '10:00 AM',
        location: 'Room 304, main building'
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user ? user.name : 'Patient'}!</h1>
                    <p className="opacity-90">Here's your health overview for today.</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
                    <FaUserMd className="text-9xl" />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Quick Actions & Upcoming */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link to="/book-appointment" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                <FaCalendarCheck />
                            </div>
                            <h3 className="font-bold text-gray-800">Book Appointment</h3>
                            <p className="text-sm text-gray-500 mt-1">Schedule a visit</p>
                        </Link>

                        <Link to="/search-doctor" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                <FaUserMd />
                            </div>
                            <h3 className="font-bold text-gray-800">Find Doctor</h3>
                            <p className="text-sm text-gray-500 mt-1">Search specialists</p>
                        </Link>

                        <Link to="/medical-records" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                <FaNotesMedical />
                            </div>
                            <h3 className="font-bold text-gray-800">Medical Records</h3>
                            <p className="text-sm text-gray-500 mt-1">View history</p>
                        </Link>
                    </div>

                    {/* Upcoming Appointment Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaCalendarCheck className="text-blue-600" />
                                Upcoming Appointment
                            </h2>
                            <Link to="/my-appointments" className="text-blue-600 text-sm font-semibold hover:underline">
                                View All
                            </Link>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex gap-4 items-center">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <FaUserMd className="text-2xl text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{nextAppointment.doctor}</h3>
                                    <p className="text-blue-600 font-medium">{nextAppointment.specialty}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                                    <FaClock className="text-orange-500" />
                                    <span className="font-semibold">{nextAppointment.date} at {nextAppointment.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Notifications & Profile */}
                <div className="space-y-8">
                    {/* Notifications Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaBell className="text-yellow-500" />
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                    <div>
                                        <p className="text-gray-800 text-sm font-medium leading-snug">{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-center text-sm text-gray-500 hover:text-blue-600 font-medium">
                            Mark all as read
                        </button>
                    </div>

                    {/* Profile Quick Link */}
                    <Link to="/profile" className="block bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white text-center hover:shadow-lg transition-shadow">
                        <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 border-2 border-gray-600">
                            <FaUserMd className="text-2xl" />
                        </div>
                        <h3 className="font-bold text-lg">My Profile</h3>
                        <p className="text-gray-400 text-sm mb-4">Update your personal information</p>
                        <span className="inline-flex items-center text-sm font-semibold text-blue-300">
                            Go to Profile <FaChevronRight className="ml-1 text-xs" />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
