// pages/doctor/DoctorSchedule.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaCalendarPlus, FaEdit, FaTrash, FaClock, FaUser, FaStethoscope, FaFilter } from 'react-icons/fa';

const DoctorSchedule = () => {
  const [schedule] = useState([
    { id: 1, patientName: 'John Smith', date: '2024-01-18', time: '09:00 AM', duration: '30 min', type: 'Follow-up', status: 'confirmed' },
    { id: 2, patientName: 'Emily Johnson', date: '2024-01-18', time: '10:30 AM', duration: '45 min', type: 'Consultation', status: 'confirmed' },
    { id: 3, patientName: 'Michael Brown', date: '2024-01-18', time: '02:00 PM', duration: '60 min', type: 'New Patient', status: 'pending' },
    { id: 4, patientName: 'Sarah Miller', date: '2024-01-19', time: '11:00 AM', duration: '30 min', type: 'Check-up', status: 'confirmed' },
    { id: 5, patientName: 'David Wilson', date: '2024-01-19', time: '03:30 PM', duration: '45 min', type: 'Follow-up', status: 'confirmed' },
  ]);

  const [availability] = useState([
    { day: 'Monday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'] },
    { day: 'Tuesday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'] },
    { day: 'Wednesday', slots: ['09:00 AM - 12:00 PM'] },
    { day: 'Thursday', slots: ['09:00 AM - 12:00 PM', '02:00 PM - 05:00 PM'] },
    { day: 'Friday', slots: ['09:00 AM - 12:00 PM'] },
  ]);

  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSchedule = schedule.filter(app => {
    const matchesDate = dateFilter === 'all' || app.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Follow-up': return 'bg-blue-100 text-blue-800';
      case 'Consultation': return 'bg-purple-100 text-purple-800';
      case 'New Patient': return 'bg-green-100 text-green-800';
      case 'Check-up': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <button className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center">
            <FaCalendarPlus className="mr-2" />
            Add New Slot
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="2024-01-18">Today (Jan 18)</option>
                <option value="2024-01-19">Tomorrow (Jan 19)</option>
                <option value="2024-01-20">Jan 20</option>
              </select>
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
              </select>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {filteredSchedule.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-gray-400" />
                        <h3 className="font-bold text-lg text-gray-900">{appointment.patientName}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaClock />
                          <span>{appointment.time} • {appointment.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStethoscope />
                          <span className={`px-2 py-1 rounded-full ${getTypeColor(appointment.type)}`}>
                            {appointment.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                          <FaEdit />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Cancel">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Date: {appointment.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Availability */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Availability</h2>
            <div className="space-y-4">
              {availability.map((day, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">{day.day}</h3>
                  <div className="space-y-2">
                    {day.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium text-blue-700">{slot}</span>
                        <button className="text-xs text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                    + Add Time Slot
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;