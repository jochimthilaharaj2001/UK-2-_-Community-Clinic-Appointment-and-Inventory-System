import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import { FaCalendarAlt, FaHistory, FaClock, FaUserMd, FaClipboardList } from 'react-icons/fa';
import api from '../../services/api';

const PatientDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [stats, setStats] = useState({
        totalAppointments: 0,
        upcomingAppointments: 0,
        pastAppointments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, these would be actual API calls
                // const response = await api.get('/patient/dashboard-stats');
                // setStats(response.data);

                // Simulating data for demonstration as per SRS requirements for dashboard
                setTimeout(() => {
                    setStats({
                        totalAppointments: 12,
                        upcomingAppointments: 2,
                        pastAppointments: 10
                    });
                    setRecentAppointments([
                        { id: 1, doctor: 'Dr. Sarah Wilson', date: '2026-01-25', time: '10:00 AM', status: 'Approved', specialization: 'Cardiologist' },
                        { id: 2, doctor: 'Dr. James Davis', date: '2026-01-28', time: '02:30 PM', status: 'Pending', specialization: 'General Physician' },
                    ]);
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Total Appointments',
            value: stats.totalAppointments,
            icon: <FaCalendarAlt className="text-2xl text-blue-600" />,
            color: 'bg-blue-50 border-blue-200'
        },
        {
            title: 'Upcoming',
            value: stats.upcomingAppointments,
            icon: <FaClock className="text-2xl text-green-600" />,
            color: 'bg-green-50 border-green-200'
        },
        {
            title: 'Past Appointments',
            value: stats.pastAppointments,
            icon: <FaHistory className="text-2xl text-purple-600" />,
            color: 'bg-purple-50 border-purple-200'
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 p-6 ml-64">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'Patient'}</h1>
                    <p className="text-gray-600">Health is wealth. Keep track of your clinic visits here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                            <a href="/patient/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View All →
                            </a>
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : recentAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {recentAppointments.map((app) => (
                                    <div key={app.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <FaUserMd size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{app.doctor}</p>
                                                <p className="text-sm text-gray-500">{app.specialization}</p>
                                                <p className="text-xs text-blue-600 mt-1">{app.date} | {app.time}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No upcoming appointments.</p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="/patient/appointments" className="p-6 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl transition text-center group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📅</div>
                                <div className="font-bold">Book Visit</div>
                                <p className="text-xs text-blue-600 mt-1">Search & Book Doctors</p>
                            </a>
                            <a href="/patient/medical-records" className="p-6 bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl transition text-center group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💊</div>
                                <div className="font-bold">My Records</div>
                                <p className="text-xs text-green-600 mt-1">View Prescriptions</p>
                            </a>
                            <a href="/patient/profile" className="p-6 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl transition text-center group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👤</div>
                                <div className="font-bold">My Profile</div>
                                <p className="text-xs text-purple-600 mt-1">Update Info</p>
                            </a>
                            <div className="p-6 bg-orange-50 text-orange-700 rounded-2xl text-center flex flex-col justify-center">
                                <div className="text-sm font-bold">Health Tip</div>
                                <p className="text-xs mt-2 italic">"Drink at least 8 glasses of water daily."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
