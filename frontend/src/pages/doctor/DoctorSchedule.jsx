import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaCalendarPlus, FaEdit, FaTrash, FaClock, FaUser, FaStethoscope, FaFilter } from 'react-icons/fa';

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availability, setAvailability] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [newSlot, setNewSlot] = useState({
    patient_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '09:00',
    reason: ''
  });

  useEffect(() => {
    fetchSchedule();
    fetchAvailability();
    fetchPatients();
  }, [dateFilter, statusFilter]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctor/appointments?date=${dateFilter === 'all' ? '' : dateFilter}&status=${statusFilter === 'all' ? '' : statusFilter}`);
      setSchedule(res.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await api.get('/doctor/schedule');
      // Transform backend data to match UI structure
      const grouped = res.data.reduce((acc, curr) => {
        if (!acc[curr.day_of_week]) acc[curr.day_of_week] = [];
        acc[curr.day_of_week].push({
          id: curr.id,
          time: `${curr.start_time.substring(0, 5)} - ${curr.end_time.substring(0, 5)}`
        });
        return acc;
      }, {});

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const formatted = days.map(day => ({
        day,
        slots: (grouped[day] || []).map(s => s.time)
      }));
      setAvailability(formatted);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/doctor/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSaveAvailability = async () => {
    try {
      const formatted = [];
      availability.forEach(day => {
        day.slots.forEach(slot => {
          const [start, end] = slot.split(' - ');
          formatted.push({
            day_of_week: day.day,
            start_time: start.trim(),
            end_time: end.trim(),
            is_available: 1
          });
        });
      });

      await api.put('/doctor/schedule', { schedules: formatted });
      alert('Availability saved successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Failed to save availability');
    }
  };

  const handleAddSlot = (dayIndex) => {
    const time = prompt('Enter time slot (e.g. 09:00 - 12:00)');
    if (time && time.includes('-')) {
      const newAvailability = [...availability];
      newAvailability[dayIndex].slots.push(time);
      setAvailability(newAvailability);
    } else if (time) {
      alert('Invalid format. Use HH:MM - HH:MM');
    }
  };

  const handleRemoveSlot = (dayIndex, slotIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(newAvailability);
  };

  const handleAddNewSlot = async (e) => {
    e.preventDefault();
    try {
      if (!newSlot.patient_id || !newSlot.appointment_date || !newSlot.appointment_time) {
        alert('Please fill in all required fields');
        return;
      }

      await api.post('/doctor/appointments', {
        ...newSlot
      });

      setShowAddModal(false);
      fetchSchedule();
      setNewSlot({
        patient_id: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '09:00',
        reason: ''
      });
      alert('Appointment added successfully!');
    } catch (error) {
      console.error('Error adding appointment:', error);
      const message = error.response?.data?.message || 'Failed to add appointment';
      alert(message);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const filteredSchedule = schedule;

  if (loading) return <LoadingSpinner />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
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
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
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
                <option value={todayStr}>Today</option>
                <option value={tomorrowStr}>Tomorrow</option>
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
              {filteredSchedule.length > 0 ? filteredSchedule.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-gray-400" />
                        <h3 className="font-bold text-lg text-gray-900">{appointment.patient_name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaClock />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStethoscope />
                          <span className={`px-2 py-1 rounded-full ${getTypeColor(appointment.reason || 'Check-up')}`}>
                            {appointment.reason || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Date: {new Date(appointment.appointment_date).toLocaleDateString()}
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                  <p>No appointments found for the selected criteria.</p>
                </div>
              )}
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
                        <button
                          onClick={() => handleRemoveSlot(index, slotIndex)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAddSlot(index)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Time Slot
                  </button>
                </div>
              ))}
              <button
                onClick={handleSaveAvailability}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Appointment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaFilter />
              </button>
            </div>
            <form onSubmit={handleAddNewSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newSlot.patient_id}
                  onChange={(e) => setNewSlot({ ...newSlot, patient_id: e.target.value })}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newSlot.appointment_date}
                    onChange={(e) => setNewSlot({ ...newSlot, appointment_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newSlot.appointment_time}
                    onChange={(e) => setNewSlot({ ...newSlot, appointment_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason/Visit Type</label>
                <input
                  type="text"
                  placeholder="e.g. Routine Check-up"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newSlot.reason}
                  onChange={(e) => setNewSlot({ ...newSlot, reason: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
