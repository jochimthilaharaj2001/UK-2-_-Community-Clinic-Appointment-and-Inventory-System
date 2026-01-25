// pages/doctor/DoctorDashboard.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaUsers, FaCalendarAlt, FaClipboardList, FaChartLine, FaUserInjured, FaStethoscope } from 'react-icons/fa';
import DoctorProfileSummary from '../../components/DoctorProfileSummary';
import { Link, useNavigate } from 'react-router-dom';


const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({

    todayAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0,
    satisfactionRate: 0,
    monthlyEarnings: 0,
    availableSlots: 0
  });

  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch Stats
        const statsRes = await fetch('http://localhost:5000/api/doctor/dashboard/stats', { headers });
        const statsData = await statsRes.json();

        if (statsRes.ok) {
          setStats(prev => ({ ...prev, ...statsData }));
        }

        // Fetch Appointments
        const appRes = await fetch('http://localhost:5000/api/doctor/appointments', { headers });
        const appData = await appRes.json();

        if (appRes.ok) {
          // Filter for today's appointments
          const today = new Date().toISOString().split('T')[0];
          const formattedApps = appData.map(app => ({
            ...app,
            date: app.appointment_date ? new Date(app.appointment_date).toISOString().split('T')[0] : 'N/A',
            time: app.appointment_time || 'N/A'
          }));
          const todaysApps = formattedApps.filter(app => app.date === today);
          setAppointments(todaysApps);
        }

        // Fetch Patients (simulating recent patients from appointments for now)
        // ideally we have an endpoint for recent patients or we derive it
        const patRes = await fetch('http://localhost:5000/api/doctor/patients', { headers });
        const patData = await patRes.json();

        if (patRes.ok) {
          // Just take first 5 for now
          setRecentPatients(patData.slice(0, 5));
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      change: "Daily",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <FaUsers className="text-2xl" />,
      color: "from-green-500 to-green-600",
      change: "Total",
    },
    {
      title: "Pending Prescriptions",
      value: stats.pendingPrescriptions,
      icon: <FaClipboardList className="text-2xl" />,
      color: "from-yellow-500 to-yellow-600",
      change: "Action Needed",
    },
    {
      title: "Satisfaction Rate",
      value: `${stats.satisfactionRate}/5`,
      icon: <FaChartLine className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      change: "Average",
    },
    {
      title: "Monthly Earnings",
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      icon: <FaStethoscope className="text-2xl" />,
      color: "from-teal-500 to-teal-600",
      change: "This Month",
    },
    {
      title: "Available Slots",
      value: stats.availableSlots,
      icon: <FaUserInjured className="text-2xl" />,
      color: "from-indigo-500 to-indigo-600",
      change: "Remaining",
    },
  ];

  const quickActions = [
    { label: 'View Schedule', icon: '📅', path: '/doctor/schedule' },
    { label: 'Write Prescription', icon: '📝', path: '/doctor/prescriptions' }, // Changed to list view first usually
    { label: 'View Patients', icon: '👥', path: '/doctor/patients' },
    { label: 'Teleconsultation', icon: '📞', path: '/doctor/teleconsult' },
  ];

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-700 font-bold">Rural Siddha Hospital</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-sm">Thellipalai</span>
              </div>
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
              {/* 
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        Add Availability
      </button>
      */}
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
                {/* 
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') || stat.change.includes('%') 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                */}
                <span className="text-sm text-gray-500 font-medium">
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
              <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-gray-500 italic">No appointments for today.</p>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">{appointment.type || 'General Checkup'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{appointment.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="p-6 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition text-center block"
                >
                  <div className="text-3xl mb-3 flex justify-center">{action.icon}</div>
                  <div className="font-medium">{action.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Patient List</h2>
            <Link to="/doctor/patients" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Patients →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-gray-600 font-medium">Patient Name</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Email</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Gender</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Blood Group</th>
                  <th className="py-3 text-left text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length === 0 ? (
                  <tr><td colSpan="5" className="py-4 text-center text-gray-500">No patients found.</td></tr>
                ) : (
                  recentPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium">
                              {patient.name ? patient.name.split(' ').map(n => n[0]).join('') : '?'}
                            </span>
                          </div>
                          <span className="font-medium">{patient.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">{patient.email}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {patient.gender || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 text-blue-600 font-medium">{patient.blood_group || 'N/A'}</td>
                      <td className="py-4">
                        <button
                          onClick={() => navigate('/doctor/patients')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                        >
                          View Details
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
