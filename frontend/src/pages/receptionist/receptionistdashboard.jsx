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

  // Dashboard stats
  const [stats] = useState({
    todayAppointments: 24,
    totalPatients: 342,
    pendingPayments: 8,
    waitingRoom: 3,
    completedAppointments: 19,
    newPatients: 12,
  });

  // Appointments data
  const [appointments] = useState([
    { id: 1, patient: 'Raja', doctor: 'Dr. Karthikayani', time: '09:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Sivakumar', doctor: 'Dr. Anbu', time: '10:30 AM', status: 'Waiting' },
    { id: 3, patient: 'Karthikeyan', doctor: 'Dr. Vignesh', time: '11:15 AM', status: 'Confirmed' },
    { id: 4, patient: 'Vijayalakshmi', doctor: 'Dr. Priya', time: '02:00 PM', status: 'Pending' },
    { id: 5, patient: 'Kanagarajah', doctor: 'Dr. Harini', time: '03:30 PM', status: 'Confirmed' },
  ]);

  // Waiting room patients
  const [waitingPatients] = useState([
    { id: 1, name: 'Vimalan', checkIn: '08:45 AM', waitTime: '15 min', priority: 'Routine' },
    { id: 2, name: 'David ', checkIn: '09:15 AM', waitTime: '45 min', priority: 'Urgent' },
    { id: 3, name: 'Sathish Kumar', checkIn: '09:30 AM', waitTime: '30 min', priority: 'Routine' },
  ]);

  // Pending payments
  const [pendingPayments] = useState([
    { id: 1, patient: 'Aravind', amount: 150, dueDate: '2024-01-20', status: 'Overdue' },
    { id: 2, patient: 'Priya Nadarajah', amount: 85, dueDate: '2024-01-22', status: 'Pending' },
    { id: 3, patient: 'Kumaravel', amount: 200, dueDate: '2024-01-25', status: 'Pending' },
  ]);

  
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'New appointment booked for 10:30 AM', time: '5 min ago', read: false },
      { id: 2, message: 'Patient checked in - Sarah Johnson', time: '15 min ago', read: false },
      { id: 3, message: 'Payment received from John Doe', time: '1 hour ago', read: true },
    ]);
  }, []);


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
                {appointments.map(a => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{a.patient}</td>
                    <td className="py-3">{a.doctor}</td>
                    <td className="py-3">{a.time}</td>
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
          {waitingPatients.map(p => (
            <div key={p.id} className="p-3 border rounded-lg mb-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">Checked in: {p.checkIn} • Wait: {p.waitTime}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${p.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {p.priority}
              </span>
            </div>
          ))}
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>
          {pendingPayments.map(p => (
            <div key={p.id} className="p-3 border rounded-lg mb-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.patient}</p>
                <p className="text-sm text-gray-500">Due: {p.dueDate}</p>
              </div>
              <p className="font-bold">${p.amount}</p>
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
