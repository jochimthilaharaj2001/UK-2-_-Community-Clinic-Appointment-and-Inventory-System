import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaCalendarCheck, FaUserMd, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const ReceptionistAppointments = () => {
  const [appointments] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'PAT001',
      doctor: 'Dr. Jane Smith',
      department: 'Cardiology',
      date: '2024-01-18',
      time: '09:00 AM',
      duration: '30 min',
      type: 'Follow-up',
      status: 'confirmed',
      contact: '+94 77 123 4567'
    },
    {
      id: 2,
      patientName: 'Emily Johnson',
      patientId: 'PAT002',
      doctor: 'Dr. Mark Wilson',
      department: 'General Medicine',
      date: '2024-01-18',
      time: '09:30 AM',
      duration: '45 min',
      type: 'Consultation',
      status: 'waiting',
      contact: '+94 77 123 4567'
    },
    {
      id: 3,
      patientName: 'Michael Brown',
      patientId: 'PAT003',
      doctor: 'Dr. Sarah Lee',
      department: 'Pediatrics',
      date: '2024-01-18',
      time: '10:00 AM',
      duration: '60 min',
      type: 'New Patient',
      status: 'checked-in',
      contact: '+94 77 123 4567'
    },
    {
      id: 4,
      patientName: 'Sarah Miller',
      patientId: 'PAT004',
      doctor: 'Dr. Robert Chen',
      department: 'Orthopedics',
      date: '2024-01-19',
      time: '11:00 AM',
      duration: '30 min',
      type: 'Check-up',
      status: 'pending',
      contact: '+94 77 123 4567'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientId: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    duration: '30',
    type: 'Consultation',
    contact: ''
  });

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDate = dateFilter === 'all' || app.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
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

  const handleStatusUpdate = (id, newStatus) => {
    alert(`Appointment ${id} status updated to ${newStatus}`);
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
                <option value="confirmed">Confirmed</option>
                <option value="waiting">Waiting</option>
                <option value="checked-in">Checked-in</option>
                <option value="pending">Pending</option>
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
                <option value="2024-01-18">Today (Jan 18)</option>
                <option value="2024-01-19">Tomorrow (Jan 19)</option>
                <option value="2024-01-20">Jan 20</option>
              </select>
            </div>

            <div>
              <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
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
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.patientId}</p>
                        <p className="text-xs text-gray-400">{appointment.contact}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor}</p>
                        <p className="text-sm text-gray-500">{appointment.department}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.date}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-1" />
                          {appointment.time} • {appointment.duration}
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
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center"
                          >
                            <FaCheck className="mr-1" /> Confirm
                          </button>
                        )}
                        {appointment.status === 'waiting' && (
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'checked-in')}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                          >
                            Check-in
                          </button>
                        )}
                        {appointment.status !== 'cancelled' && (
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                      Duration
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
                      placeholder="+94 77 123 4567"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Format: +94 77 123 4567 or 07X XXX XXXX
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg">
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
