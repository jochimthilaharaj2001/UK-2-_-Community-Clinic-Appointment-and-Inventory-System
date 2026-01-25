
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import {
    FaCalendarAlt,
    FaClipboardList,
    FaHistory,
    FaClock,
    FaBell,
    FaFilePrescription,
    FaStethoscope,
    FaArrowRight
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [stats, setStats] = useState({ upcomingAppointments: 0, totalPrescriptions: 0, totalReports: 0 });
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (userData && userData.role === 'patient') {
            setUser(userData);
            fetchDashboardData(token);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        console.log("🚀 START FETCHING DASHBOARD DATA...");
        try {
            // Stats
            const statsRes = await fetch('http://localhost:5000/api/patient/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } });
            console.log("Stats API Status:", statsRes.status);
            if (statsRes.ok) {
                const s = await statsRes.json();
                console.log("✅ Stats Data:", s);
                setStats(s);
            } else {
                console.error("❌ Stats API Error:", await statsRes.text());
            }

            // Appointments (Limit 2)
            const aptRes = await fetch('http://localhost:5000/api/patient/appointments', { headers: { 'Authorization': `Bearer ${token}` } });
            console.log("Appointments API Status:", aptRes.status);
            if (aptRes.ok) {
                const data = await aptRes.json();
                console.log("✅ Appointments Data:", data);
                if (Array.isArray(data)) {
                    setAppointments(data.slice(0, 2).map(a => ({
                        ...a,
                        status: a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1).toLowerCase() : 'Pending'
                    })));
                } else {
                    console.warn("⚠️ Appointments data is NOT an array:", data);
                    setAppointments([]);
                }
            }

            // Prescriptions (Limit 2)
            const medRes = await fetch('http://localhost:5000/api/patient/medical-records', { headers: { 'Authorization': `Bearer ${token}` } });
            console.log("Medical Records API Status:", medRes.status);
            if (medRes.ok) {
                const data = await medRes.json();
                console.log("✅ Medical Records Data:", data);
                setPrescriptions(Array.isArray(data.prescriptions) ? data.prescriptions.slice(0, 2) : []);

                // Update stats if needed based on actual listing
                // setStats(prev => ({...prev, totalReports: (data.reports?.length || 0) }));
            }

            // Notifications
            const notifRes = await fetch('http://localhost:5000/api/patient/notifications', { headers: { 'Authorization': `Bearer ${token}` } });
            if (notifRes.ok) {
                const data = await notifRes.json();
                setNotifications(Array.isArray(data) ? data : []);
            }

        } catch (error) {
            console.error("🔥 CRITICAL DASHBOARD IMPORT ERROR:", error);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-indigo-600 font-bold">Rural Siddha Hospital</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 text-sm">Thellipalai</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name || 'Patient'}!</h1>
                        <p className="text-gray-600">Track your health and appointments at a glance.</p>
                    </div>
                    <div className="flex gap-4 relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2 rounded-full shadow-sm transition ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600 hover:shadow-md'}`}
                        >
                            <FaBell className="text-xl" />
                            {notifications.some(n => n.unread) && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-scaleIn">
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-indigo-50/50">
                                    <h3 className="font-bold text-gray-800">Notifications</h3>
                                    <button
                                        onClick={() => {
                                            setNotifications(notifications.map(n => ({ ...n, unread: false })));
                                        }}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => {
                                                    setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, unread: false } : notif));
                                                    navigate(n.link);
                                                    setShowNotifications(false);
                                                }}
                                                className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition cursor-pointer ${n.unread ? 'bg-indigo-50/20' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-sm text-gray-800">{n.title}</h4>
                                                    <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                                    )}
                                </div>
                                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                    <button
                                        onClick={() => navigate('/patient/notifications')}
                                        className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition"
                                    >
                                        View All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Upcoming Appointments"
                        value={stats.upcomingAppointments || 0}
                        icon={<FaCalendarAlt />}
                        color="bg-indigo-500"
                    />
                    <StatsCard
                        title="Active Prescriptions"
                        value={stats.totalPrescriptions || 0}
                        icon={<FaFilePrescription />}
                        color="bg-green-500"
                    />
                    <StatsCard
                        title="Medical Records"
                        value={stats.totalReports || 0}
                        icon={<FaClipboardList />}
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="Last Visit"
                        value={appointments[0]?.date || 'N/A'}
                        icon={<FaHistory />}
                        color="bg-orange-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                            <div className="flex items-center gap-3">
                                <FaClock className="text-indigo-600 text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
                            </div>
                            <button onClick={() => navigate('/patient/appointments')} className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1">
                                View All <FaArrowRight size={12} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {appointments.length > 0 ? (
                                    appointments.map((apt) => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                    <FaStethoscope />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{apt.doctor}</h3>
                                                    <p className="text-sm text-gray-500">{apt.type}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-800">{apt.date}</p>
                                                <p className="text-sm text-gray-500">{apt.time}</p>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500 italic">No upcoming appointments</div>
                                )}
                            </div>
                            <button
                                onClick={() => navigate('/patient/book-appointment')}
                                className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                            >
                                Book New Appointment
                            </button>
                        </div>
                    </div>

                    {/* Recent Prescriptions */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50">
                            <div className="flex items-center gap-3">
                                <FaFilePrescription className="text-green-600 text-xl" />
                                <h2 className="text-xl font-bold text-gray-800">Recent Prescriptions</h2>
                            </div>
                            <button onClick={() => navigate('/patient/medical-records')} className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-1">
                                View History <FaArrowRight size={12} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {prescriptions.length > 0 ? (
                                    prescriptions.map((p) => (
                                        <div key={p.id} className="p-4 border border-gray-100 rounded-xl hover:border-green-200 hover:shadow-sm transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-800">{p.med}</h3>
                                                <span className="text-xs text-gray-400">{p.date}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-600">Dosage: <span className="text-gray-800 font-medium">{p.dosage}</span></p>
                                                    <p className="text-xs text-gray-500 mt-1 italic">{p.instructions}</p>
                                                </div>
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                    <FaFilePrescription />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500 italic">No recent prescriptions</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
