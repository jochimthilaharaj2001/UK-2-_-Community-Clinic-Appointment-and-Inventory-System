import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCalendarCheck, FaUserMd, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const ReceptionistAppointments = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();

    // Check if we have patient data from navigation state
    if (location.state?.patientId) {
      setNewAppointment(prev => ({
        ...prev,
        patientId: `PAT${String(location.state.patientId).padStart(3, '0')}`,
        patientName: location.state.patientName || '',
      }));
      setShowForm(true);
    }
  }, [location.state]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/receptionist/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    patientName: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    duration: '30',
    type: 'Consultation',
    contact: '',
    notes: ''
  });

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = (app.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.patient_id || '').toString().includes(searchTerm) ||
      (app.doctor_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = dateFilter === 'all' || app.appointment_date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Follow-up': return 'bg-blue-50 text-blue-700';
      case 'Consultation': return 'bg-purple-50 text-purple-700';
      case 'New Patient': return 'bg-green-50 text-green-700';
      case 'Check-up': return 'bg-yellow-50 text-yellow-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/receptionist/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/receptionist/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAppointment)
      });
      if (response.ok) {
        setShowForm(false);
        fetchAppointments();
        setNewAppointment({
          patientId: '', patientName: '', doctor: '', department: '',
          date: '', time: '', duration: '30', type: 'Consultation',
          contact: '', notes: ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    if (filteredAppointments.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Patient Name', 'Patient ID', 'Doctor', 'Date', 'Time', 'Type', 'Status'];
    const csvData = filteredAppointments.map(app => [
      `"${app.patient_name || app.patient_id}"`,
      `"${app.patient_id}"`,
      `"${app.doctor_name}"`,
      `"${app.appointment_date}"`,
      `"${app.appointment_time}"`,
      `"${app.type}"`,
      `"${app.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600">Schedule and manage patient appointments</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            Schedule Appointment
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="waiting">Waiting</option>
                <option value="checked-in">Checked-in</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Dates</option>
                <option value={new Date().toISOString().split('T')[0]}>Today</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleExport}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Export List
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Patient</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Doctor</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                ) : filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient_name || appointment.patient_id}</p>
                        <p className="text-sm text-gray-500">{appointment.patient_id}</p>
                        <p className="text-xs text-gray-400">{appointment.contact}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor_name}</p>
                        <p className="text-sm text-gray-500">{appointment.department}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.appointment_date}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-1" />
                          {appointment.appointment_time} • {appointment.duration} min
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {appointment.status.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center"
                          >
                            <FaCheck className="mr-1" /> Confirm
                          </button>
                        )}
                        {appointment.status.toLowerCase() === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'waiting')}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg"
                          >
                            Arrived
                          </button>
                        )}
                        {appointment.status.toLowerCase() === 'waiting' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'checked-in')}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                          >
                            Check-in
                          </button>
                        )}
                        {appointment.status.toLowerCase() !== 'cancelled' && appointment.status.toLowerCase() !== 'checked-in' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg flex items-center"
                          >
                            <FaTimes className="mr-1" /> Cancel
                          </button>
                        )}
                        <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Appointment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      value={newAppointment.patientId}
                      onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="PAT001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor *
                    </label>
                    <select
                      value={newAppointment.doctor}
                      onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select Doctor</option>
                      <option value="Dr. Jane Smith">Dr. Jane Smith</option>
                      <option value="Dr. Mark Wilson">Dr. Mark Wilson</option>
                      <option value="Dr. Sarah Lee">Dr. Sarah Lee</option>
                      <option value="Dr. Robert Chen">Dr. Robert Chen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={newAppointment.department}
                      onChange={(e) => setNewAppointment({ ...newAppointment, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Cardiology"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (min)
                    </label>
                    <select
                      value={newAppointment.duration}
                      onChange={(e) => setNewAppointment({ ...newAppointment, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">60 min</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <select
                      value={newAppointment.type}
                      onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Check-up">Check-up</option>
                      <option value="New Patient">New Patient</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={newAppointment.contact}
                      onChange={(e) => setNewAppointment({ ...newAppointment, contact: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleScheduleAppointment}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg"
                >
                  Schedule Appointment
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistAppointments;