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

  const statCards = [
    {
      title: "Today's Appointments",
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
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

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
                  </div>
                </div>
              ))}
            </div>
          </div>

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
      </div>
    </div>
  );
};

export default ReceptionistDashboard;