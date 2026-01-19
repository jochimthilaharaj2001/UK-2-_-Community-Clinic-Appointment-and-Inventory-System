import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  FaCalendarCheck,
  FaUserInjured,
  FaMoneyBillWave,
  FaClock,
  FaBell,
  FaSearch,
  FaPlus
} from 'react-icons/fa';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    todayAppointments: 24,
    totalPatients: 342,
    pendingPayments: 8,
    waitingRoom: 5
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <h1 className="text-3xl font-bold mb-6">Reception Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <FaCalendarCheck />
            <h2>{stats.todayAppointments}</h2>
            <p>Today Appointments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
