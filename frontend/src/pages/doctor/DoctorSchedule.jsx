// pages/doctor/DoctorSchedule.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaCalendarPlus, FaEdit, FaTrash, FaClock, FaUser, FaStethoscope, FaFilter } from 'react-icons/fa';

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [availability, setAvailability] = useState([]); // Simplified for now or fetching from profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');

      const data = await response.json();
      // Format data for frontend use
      const formattedData = data.map(app => ({
        ...app,
        date: app.appointment_date ? new Date(app.appointment_date).toISOString().split('T')[0] : 'N/A',
        time: app.appointment_time || 'N/A'
      }));
      setSchedule(formattedData);
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/doctor/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Update local state
      setSchedule(prev => prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));

    } catch (err) {
      console.error(err);
      alert('Failed to update appointment status');
    }
  };

  const filteredSchedule = schedule.filter(app => {
    const matchesDate = dateFilter === 'all' || app.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesDate && matchesStatus;
  });


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }

  };

  const getTypeColor = (type) => {
    return 'bg-blue-100 text-blue-800'; // Defaulting as backend might not have 'type' yet
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 flex justify-center items-center">
        Loading schedule...
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
            <p className="text-gray-600">Manage your appointments and availability</p>
          </div>
          {/* 
          <button className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center">
            <FaCalendarPlus className="mr-2" />
            Add New Slot
          </button>
          */}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
              <input
                type="date"
                value={dateFilter === 'all' ? '' : dateFilter}
                onChange={(e) => setDateFilter(e.target.value || 'all')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => setDateFilter('all')} className="text-xs text-blue-600 mt-1">Clear Date Filter</button>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Changed to 1 col as Availability is not fully tied to backend yet */}

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Appointments</h2>
            <div className="space-y-4">
              {filteredSchedule.length === 0 ? (
                <p className="text-gray-500">No appointments found.</p>
              ) : (
                filteredSchedule.map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FaUser className="text-gray-400" />
                          <h3 className="font-bold text-lg text-gray-900">{appointment.patientName || `Patient #${appointment.patient_id}`}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{appointment.time}</span>
                          </div>
                          {appointment.type && (
                            <div className="flex items-center gap-1">
                              <FaStethoscope />
                              <span className={`px-2 py-1 rounded-full ${getTypeColor(appointment.type)}`}>
                                {appointment.type}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(appointment.id, 'confirmed')}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateStatus(appointment.id, 'cancelled')}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => updateStatus(appointment.id, 'completed')}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Date: {appointment.date}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
