// pages/doctor/DoctorDashboard.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaUsers, FaCalendarAlt, FaClipboardList, FaChartLine, FaUserInjured, FaStethoscope } from 'react-icons/fa';
import DoctorProfileSummary from '../../components/DoctorProfileSummary';

const DoctorDashboard = () => {
  const [stats] = useState({
    todayAppointments: 12,
    totalPatients: 156,
    pendingPrescriptions: 3,
    satisfactionRate: 4.7,
    monthlyEarnings: 12500,
    availableSlots: 8
  });

  const [appointments] = useState([
    { id: 1, patientName: 'John Smith', time: '09:00 AM', status: 'confirmed', type: 'Follow-up' },
    { id: 2, patientName: 'Emily Johnson', time: '10:30 AM', status: 'confirmed', type: 'Consultation' },
    { id: 3, patientName: 'Michael Brown', time: '02:00 PM', status: 'pending', type: 'New Patient' },
    { id: 4, patientName: 'Sarah Miller', time: '03:30 PM', status: 'confirmed', type: 'Check-up' },
  ]);

  const [recentPatients] = useState([
    { id: 1, name: 'Robert Wilson', lastVisit: '2024-01-15', condition: 'Hypertension', nextAppointment: '2024-02-15' },
    { id: 2, name: 'Jennifer Lee', lastVisit: '2024-01-14', condition: 'Diabetes', nextAppointment: '2024-02-14' },
    { id: 3, name: 'David Chen', lastVisit: '2024-01-12', condition: 'Asthma', nextAppointment: '2024-02-12' },
  ]);

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      change: "+2",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <FaUsers className="text-2xl" />,
      color: "from-green-500 to-green-600",
      change: "+8",
    },
    {
      title: "Pending Prescriptions",
      value: stats.pendingPrescriptions,
      icon: <FaClipboardList className="text-2xl" />,
      color: "from-yellow-500 to-yellow-600",
      change: "-1",
    },
    {
      title: "Satisfaction Rate",
      value: `${stats.satisfactionRate}/5`,
      icon: <FaChartLine className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      change: "+0.2",
    },
    {
      title: "Monthly Earnings",
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      icon: <FaStethoscope className="text-2xl" />,
      color: "from-teal-500 to-teal-600",
      change: "+12%",
    },
    {
      title: "Available Slots",
      value: stats.availableSlots,
      icon: <FaUserInjured className="text-2xl" />,
      color: "from-indigo-500 to-indigo-600",
      change: "-3",
    },
  ];

  const quickActions = [
    { label: 'View Schedule', icon: '📅', path: '/doctor/schedule' },
    { label: 'Write Prescription', icon: '📝', path: '/doctor/prescriptions/new' },
    { label: 'View Patients', icon: '👥', path: '/doctor/patients' },
    { label: 'Teleconsultation', icon: '📞', path: '/doctor/teleconsult' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
       <div className="mb-8">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
      <p className="text-gray-600">Welcome back! Here's your day at a glance.</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </span>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        Add Availability
      </button>
    </div>
  </div>
  
  {/* Add profile summary */}
  <div className="mb-6">
    <DoctorProfileSummary />
  </div>
</div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') || stat.change.includes('%') 
                    ? 'text-green-600' 
                    : 'text-red-600'
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
              <a href="/doctor/schedule" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Schedule →
              </a>
            </div>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{appointment.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.path}
                  className="p-6 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition text-center"
                >
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <div className="font-medium">{action.label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
            <a href="/doctor/patients" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Patients →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-gray-600 font-medium">Patient Name</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Last Visit</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Condition</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Next Appointment</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{patient.lastVisit}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {patient.condition}
                      </span>
                    </td>
                    <td className="py-4 text-blue-600 font-medium">{patient.nextAppointment}</td>
                    <td className="py-4">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;