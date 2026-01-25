import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  FaCalendarCheck,
  FaUserInjured,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
  FaBell,
  FaUserCircle,
} from 'react-icons/fa';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useRef(null);

  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingPayments: 0,
    waitingRoom: 0,
    completedAppointments: 0,
    newPatients: 0,
  });

  // Appointments data
  const [appointments, setAppointments] = useState([]);

  // Waiting room patients
  const [waitingPatients, setWaitingPatients] = useState([]);

  // Pending payments
  const [pendingPayments, setPendingPayments] = useState([
    { id: 1, patient: 'Aravind', amount: 150, dueDate: '2024-01-20', status: 'Overdue' },
    { id: 2, patient: 'Priya Nadarajah', amount: 85, dueDate: '2024-01-22', status: 'Pending' },
    { id: 3, patient: 'Kumaravel', amount: 200, dueDate: '2024-01-25', status: 'Pending' },
  ]);


  useEffect(() => {
    fetchDashboardData();
    setNotifications([
      { id: 1, message: 'New appointment booked for 10:30 AM', time: '5 min ago', read: false },
      { id: 2, message: 'Patient checked in - Sarah Johnson', time: '15 min ago', read: false },
      { id: 3, message: 'Payment received from John Doe', time: '1 hour ago', read: true },
    ]);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Stats
      const statsRes = await fetch('http://localhost:5000/api/receptionist/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          todayAppointments: data.totalAppointments,
          totalPatients: data.totalPatients,
          pendingPayments: data.pendingPayments,
          waitingRoom: data.waitingPatients,
          completedAppointments: 0,
          newPatients: data.newPatients,
        });
      }

      // Appointments
      const appRes = await fetch('http://localhost:5000/api/receptionist/appointments/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (appRes.ok) {
        const data = await appRes.json();
        setAppointments(data);
        setWaitingPatients(data.filter(a => a.status === 'checked-in' || a.status === 'waiting'));
      }

      // Pending Payments
      const payRes = await fetch('http://localhost:5000/api/receptionist/dashboard/pending-payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (payRes.ok) {
        const data = await payRes.json();
        setPendingPayments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 md:ml-64">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-600 font-bold">Rural Siddha Hospital</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-sm">Thellipalai</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <FaBell className="text-xl text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              <div
                ref={notificationsRef}
                className={`absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg overflow-hidden z-50 transform transition-all duration-300 ease-out
                  ${showNotifications ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              >
                <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm p-4">No notifications</p>
                  ) : (
                    notifications.map((n, index) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b cursor-pointer transform transition-all duration-300 ease-out
                          ${!n.read ? 'bg-blue-50' : ''}
                          ${showNotifications ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                        style={{ transitionDelay: `${index * 50}ms` }} // staggered animation
                      >
                        <p className="text-sm text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
                <div
                  className="p-2 text-center text-sm text-blue-600 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                >
                  Mark all as read
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl text-gray-600" />
              <div>
                <p className="font-medium">Receptionist</p>
                <p className="text-sm text-gray-500">Front Desk</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={<FaCalendarCheck className="text-blue-600 text-3xl" />} value={stats.todayAppointments} label="Today's Appointments" />
          <StatCard icon={<FaUserInjured className="text-green-600 text-3xl" />} value={stats.totalPatients} label="Total Patients" />
          <StatCard icon={<FaMoneyBillWave className="text-purple-600 text-3xl" />} value={stats.pendingPayments} label="Pending Payments" />
          <StatCard icon={<FaClock className="text-amber-600 text-3xl" />} value={stats.waitingRoom} label="Waiting Room" />
        </div>

        {/* Appointments Table */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4 text-gray-500">No appointments for today</td></tr>
                ) : appointments.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{a.patient_name || a.patient_id}</td>
                    <td className="py-3">{a.doctor_name}</td>
                    <td className="py-3">{a.appointment_time}</td>
                    <td className="py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Waiting Room */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Waiting Room ({waitingPatients.length})</h2>
          {waitingPatients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No patients in waiting room</p>
          ) : waitingPatients.map(p => (
            <div key={p.id} className="p-3 border rounded-lg mb-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.patient_name || p.patient_id}</p>
                <p className="text-sm text-gray-500">
                  Time: {p.appointment_time} • Status: {p.status}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'checked-in' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {p.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
          {pendingPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending payments</p>
          ) : pendingPayments.map(p => (
            <div key={p.id} className="p-3 border rounded-lg mb-2 flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/receptionist/billing')}>
              <div>
                <p className="font-medium">{p.patient_name}</p>
                <p className="text-sm text-gray-500">Invoice: {p.invoice_no} • Due: {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <p className="font-bold text-red-600">${Number(p.total_amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Reusable Stat Card */
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  </div>
);

/* Status Badge */
const StatusBadge = ({ status }) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-800',
    waiting: 'bg-amber-100 text-amber-800',
    pending: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>{status}</span>;
};

export default ReceptionistDashboard;
