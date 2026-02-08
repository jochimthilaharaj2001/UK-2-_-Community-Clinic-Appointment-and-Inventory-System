import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';
import api from '../../services/api';
import {
  FaUsers, FaUserMd, FaCalendarAlt, FaPills,
  FaMoneyBillWave, FaStar
} from 'react-icons/fa';

const AdminDashboard = () => {
  console.log("AdminDashboard rendering");
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
    satisfactionRate: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AdminDashboard useEffect: Fetching stats");
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        // Defensive check: Ensure response.data is an object before setting stats
        if (response.data && typeof response.data === 'object') {
          setStats(response.data);
        } else {
          console.warn('API returned unexpected data format for stats:', response.data);
          // Optionally reset stats or handle error state
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const [recentActivities] = useState([
    { id: 1, user: 'Dr. Sarah Wilson', action: 'Completed appointment', time: '10:30 AM', type: 'appointment' },
    { id: 2, user: 'John Doe', action: 'New patient registration', time: '9:45 AM', type: 'registration' },
    { id: 3, user: 'Pharmacist', action: 'Restocked inventory', time: '9:15 AM', type: 'inventory' },
    { id: 4, user: 'System', action: 'Daily backup completed', time: '8:00 AM', type: 'system' },
    { id: 5, user: 'Dr. James Davis', action: 'Updated patient record', time: 'Yesterday', type: 'record' },
  ]);

  const statCards = [
    {
      title: 'Total Patients',
      value: (stats?.totalPatients || 0).toLocaleString(),
      icon: <FaUsers className="text-2xl text-blue-600" />,
      change: '+942%',
      trend: 'up',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Active Doctors',
      value: stats?.totalDoctors || 0,
      icon: <FaUserMd className="text-2xl text-green-600" />,
      change: '+3',
      trend: 'up',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: <FaCalendarAlt className="text-2xl text-purple-600" />,
      change: '+8%',
      trend: 'up',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: <FaPills className="text-2xl text-red-600" />,
      change: '+5',
      trend: 'up',
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'Monthly Revenue',
      value: `LKR ${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl text-yellow-600" />,
      change: '+945%',
      trend: 'up',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Satisfaction Rate',
      value: `${stats?.satisfactionRate || 0}/5`,
      icon: <FaStar className="text-2xl text-indigo-600" />,
      change: '+0.3',
      trend: 'up',
      color: 'bg-indigo-50 border-indigo-200'
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center ml-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'registration': return '👤';
      case 'inventory': return '💊';
      case 'system': return '🖥️';
      case 'record': return '📝';
      default: return '⚙️';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your clinic today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <Link to="/admin/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/users" className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-center block">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">Add User</div>
              </a>
              <a href="/admin/appointments" className="p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition text-center block">
                <div className="text-2xl mb-2">📅</div>
                <div className="font-medium">Schedule</div>
              </a>
              <a href="/admin/inventory" className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition text-center block">
                <div className="text-2xl mb-2">💊</div>
                <div className="font-medium">Inventory</div>
              </a>
              <a href="/admin/reports" className="p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition text-center block">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Reports</div>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600 font-medium">● Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backup</span>
                  <span className="text-green-600 font-medium">● Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-gray-600">99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
