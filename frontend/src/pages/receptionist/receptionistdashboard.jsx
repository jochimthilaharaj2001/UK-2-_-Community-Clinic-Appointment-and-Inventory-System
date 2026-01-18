<<<<<<< HEAD
// pages/receptionist/ReceptionistDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaCalendarPlus, 
  FaUserPlus, 
  FaUserCheck,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaPhone,
  FaChartLine,
  FaUsers,
  FaClock,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [todayDate, setTodayDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [quickStats, setQuickStats] = useState({
    totalAppointments: 24,
    waitingPatients: 3,
    newPatients: 5,
    pendingPayments: 8
  });

  useEffect(() => {
    // Set current date and time
    const now = new Date();
    setTodayDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }, 60000);
    
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));

    // Mock data - in real app, fetch from API
    setUpcomingAppointments([
      { id: 1, patientName: 'John Smith', time: '09:30 AM', doctor: 'Dr. Sarah Wilson', status: 'waiting' },
      { id: 2, patientName: 'Emily Johnson', time: '10:15 AM', doctor: 'Dr. Michael Chen', status: 'checked-in' },
      { id: 3, patientName: 'Robert Brown', time: '11:00 AM', doctor: 'Dr. Lisa Park', status: 'scheduled' },
      { id: 4, patientName: 'Sarah Miller', time: '02:30 PM', doctor: 'Dr. James Lee', status: 'confirmed' },
    ]);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const quickActions = [
    { 
      icon: <FaSearch />, 
      label: 'Search Patient', 
      description: 'Find patient records',
      path: '/receptionist/patient-search',
      color: 'bg-blue-500'
    },
    { 
      icon: <FaCalendarPlus />, 
      label: 'Book Appointment', 
      description: 'Schedule new appointment',
      path: '/receptionist/book-appointment',
      color: 'bg-green-500'
    },
    { 
      icon: <FaUserPlus />, 
      label: 'New Patient', 
      description: 'Register new patient',
      path: '/receptionist/patient-registration',
      color: 'bg-purple-500'
    },
    { 
      icon: <FaFileInvoiceDollar />, 
      label: 'Billing', 
      description: 'Process payments',
      path: '/receptionist/billing',
      color: 'bg-yellow-500'
    },
  ];
=======
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaCalendarCheck, FaUserInjured, FaMoneyBillWave, FaBell, FaSearch, FaPlus, FaClock, FaUserMd, FaStethoscope } from 'react-icons/fa';

const ReceptionistDashboard = () => {
  const [stats] = useState({
    todayAppointments: 24,
    totalPatients: 342,
    pendingPayments: 8,
    waitingRoom: 5,
    upcomingAppointments: 18,
    doctorsAvailable: 6
  });

  const [todayAppointments] = useState([
    { id: 1, patientName: 'John Smith', doctor: 'Dr. Jane Smith', time: '09:00 AM', status: 'confirmed' },
    { id: 2, patientName: 'Emily Johnson', doctor: 'Dr. Mark Wilson', time: '09:30 AM', status: 'waiting' },
    { id: 3, patientName: 'Michael Brown', doctor: 'Dr. Sarah Lee', time: '10:00 AM', status: 'checked-in' },
    { id: 4, patientName: 'Sarah Miller', doctor: 'Dr. Robert Chen', time: '10:30 AM', status: 'pending' },
  ]);

  const [waitingPatients] = useState([
    { id: 1, name: 'David Wilson', waitingTime: '15 min', doctor: 'Dr. Jane Smith', priority: 'High' },
    { id: 2, name: 'Lisa Anderson', waitingTime: '25 min', doctor: 'Dr. Mark Wilson', priority: 'Medium' },
    { id: 3, name: 'Chris Taylor', waitingTime: '5 min', doctor: 'Dr. Sarah Lee', priority: 'Low' },
  ]);
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd

  const statCards = [
    {
      title: "Today's Appointments",
<<<<<<< HEAD
      value: quickStats.totalAppointments,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      change: "+4",
    },
    {
      title: "Patients Waiting",
      value: quickStats.waitingPatients,
      icon: <FaClock className="text-2xl" />,
      color: "from-yellow-500 to-yellow-600",
      change: "-1",
    },
    {
      title: "New Patients",
      value: quickStats.newPatients,
      icon: <FaUsers className="text-2xl" />,
      color: "from-green-500 to-green-600",
      change: "+2",
    },
    {
      title: "Pending Payments",
      value: quickStats.pendingPayments,
      icon: <FaFileInvoiceDollar className="text-2xl" />,
      color: "from-red-500 to-red-600",
      change: "3",
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reception Desk</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-gray-600">{todayDate}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{currentTime}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold">R</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Jessica Reception</p>
                  <p className="text-sm text-gray-500">Front Desk</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                <FaSignOutAlt />
                <span className="hidden md:inline">Logout</span>
=======
      value: stats.todayAppointments,
      icon: <FaCalendarCheck className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      change: "+3",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <FaUserInjured className="text-2xl" />,
      color: "from-green-500 to-green-600",
      change: "+12",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: <FaMoneyBillWave className="text-2xl" />,
      color: "from-amber-500 to-amber-600",
      change: "-2",
    },
    {
      title: "In Waiting Room",
      value: stats.waitingRoom,
      icon: <FaBell className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      change: "+1",
    },
  ];

  const quickActions = [
    { label: 'New Appointment', icon: '📅', path: '/receptionist/appointments/new' },
    { label: 'Register Patient', icon: '👤', path: '/receptionist/patients/new' },
    { label: 'Process Payment', icon: '💰', path: '/receptionist/billing' },
    { label: 'View Schedule', icon: '📋', path: '/receptionist/appointments' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
              <p className="text-gray-600">Welcome Sarah! Manage clinic operations efficiently.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patient, appointment..."
                  className="pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center">
                <FaPlus className="mr-2" /> New Appointment
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
              </button>
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </div>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
          <p className="text-gray-600 mt-2">Here's what's happening at the reception today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-xl">{action.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{action.label}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
=======
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
<<<<<<< HEAD
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
=======
            <div key={index} className="bg-white rounded-2xl shadow p-6">
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
<<<<<<< HEAD
                  stat.change.startsWith('+') ? 'text-green-600' : 
                  stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
=======
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <Link 
                to="/receptionist/calendar" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-gray-900">{appointment.patientName}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{appointment.time}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200">
                        Call
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200">
                        Check-in
                      </button>
                    </div>
=======
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
              <a href="/receptionist/appointments" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                View All →
              </a>
            </div>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{appointment.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
                  </div>
                </div>
              ))}
            </div>
          </div>

<<<<<<< HEAD
          {/* Quick Patient Search */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Patient Search</h2>
            
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or ID..."
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                  Search
                </button>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm">
                  Advanced Search
                </button>
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Recent Patients</h3>
              <div className="space-y-3">
                {['John Smith', 'Emily Johnson', 'Michael Brown'].map((name, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{name}</span>
                    </div>
                    <Link 
                      to={`/receptionist/patient-search?q=${name}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
=======
          {/* Waiting Room */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Waiting Room</h2>
              <span className="text-sm text-gray-500">{waitingPatients.length} patients waiting</span>
            </div>
            <div className="space-y-4">
              {waitingPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserInjured className="text-gray-400" />
                      <p className="font-medium text-gray-900">{patient.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{patient.doctor}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-gray-400" />
                      <p className="font-bold text-gray-900">{patient.waitingTime}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      patient.priority === 'High' ? 'bg-red-100 text-red-800' :
                      patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.path}
                className="p-6 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl transition text-center hover:shadow-md"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <div className="font-medium">{action.label}</div>
              </a>
            ))}
          </div>
        </div>
>>>>>>> e7aebc6bd1f7e0f8486f6305bac29d2bda55e6fd
      </div>
    </div>
  );
};

export default ReceptionistDashboard;