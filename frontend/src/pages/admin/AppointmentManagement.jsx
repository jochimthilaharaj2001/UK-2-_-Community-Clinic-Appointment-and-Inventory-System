import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import {
  FaSearch,
  FaCalendarPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaTimes,
  FaSave,
  FaCheck,
  FaClock,
  FaUserMd,
  FaUser,
  FaPhone,
  FaStethoscope,
  FaCalendarCheck,
  FaCalendarTimes,
  FaPrint,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { format, addDays } from 'date-fns';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      // alert('Failed to load appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data); // Assuming data is array of doctors
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const defaultFormData = {
    patientName: '',
    patientId: '',
    patientAge: '',
    patientGender: 'Male',
    doctorName: '',
    doctorId: '',
    doctorSpecialization: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    duration: '30 mins',
    type: 'regular',
    reason: '',
    notes: '',
    contact: '',
    email: '',
    room: ''
  };
  const [formData, setFormData] = useState(defaultFormData);

  // Removed static doctors list, using state instead.

  const appointmentTypes = [
    { value: 'regular', label: 'Regular Checkup', color: 'bg-green-100 text-green-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-blue-100 text-blue-800' },
    { value: 'consultation', label: 'Consultation', color: 'bg-purple-100 text-purple-800' },
    { value: 'vaccination', label: 'Vaccination', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'surgery', label: 'Surgery', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'no-show', label: 'No Show', color: 'bg-gray-100 text-gray-800' }
  ];

  const startEditing = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      patientAge: appointment.patientAge,
      patientGender: appointment.patientGender,
      doctorName: appointment.doctorName,
      doctorId: appointment.doctorId,
      doctorSpecialization: appointment.doctorSpecialization,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      reason: appointment.reason || '',
      notes: appointment.notes || '',
      contact: appointment.contact,
      email: appointment.email,
      room: appointment.room || ''
    });
    setShowForm(true);
  };

  const filteredAppointments = appointments
    .filter(app => {
      const matchesSearch = app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contact?.includes(searchTerm) ||
        app.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesDate = dateFilter === 'all' || app.date === dateFilter; // might need more robust date compare for ranges
      const matchesDoctor = doctorFilter === 'all' || app.doctorId == doctorFilter; // loose compare for string/int mismatch
      const matchesType = typeFilter === 'all' || app.type === typeFilter;
      return matchesSearch && matchesStatus && matchesDate && matchesDoctor && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date + ' ' + (a.time || '00:00'));
        const dateB = new Date(b.date + ' ' + (b.time || '00:00'));
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === 'patientName') {
        return sortOrder === 'asc'
          ? a.patientName?.localeCompare(b.patientName)
          : b.patientName?.localeCompare(a.patientName);
      }
      if (sortBy === 'doctorName') {
        return sortOrder === 'asc'
          ? a.doctorName?.localeCompare(b.doctorName)
          : b.doctorName?.localeCompare(a.doctorName);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const typeObj = appointmentTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800';
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute of ['00', '30']) {
        if (hour === 18 && minute === '30') break;
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(`${time} ${hour < 12 ? 'AM' : 'PM'}`);
      }
    }
    return slots;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="text-gray-400 ml-1" />;
    return sortOrder === 'asc'
      ? <FaSortUp className="text-blue-600 ml-1" />
      : <FaSortDown className="text-blue-600 ml-1" />;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d.id == doctorId);
    if (doctor) {
      setFormData({
        ...formData,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization // ensure backend doc obj has specialization
      });
    }
  };

  const generatePatientId = () => {
    // Should likely be handled by backend, but keeping purely cosmetic for now
    const newId = `P${String(appointments.length + 1).padStart(3, '0')}`;
    setFormData({ ...formData, patientId: newId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAppointment) {
        // Update existing appointment
        await api.put(`/appointments/${editingAppointment.id}`, formData);
        alert('Appointment updated successfully!');
      } else {
        // Add new appointment
        await api.post('/appointments', formData);
        alert('Appointment scheduled successfully!');
      }

      fetchAppointments();
      setShowForm(false);
      setEditingAppointment(null);
      setFormData(defaultFormData);
    } catch (error) {
      console.error('Error saving appointment', error);
      alert('Failed to save appointment. ' + (error.response?.data?.message || ''));
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        setAppointments(appointments.filter(app => app.id !== appointmentId));
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment', error);
        alert('Failed to delete appointment');
      }
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setAppointments(appointments.map(app =>
        app.id === appointmentId ? { ...app, status: newStatus } : app
      ));
      alert(`Appointment status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error update status', error);
      alert('Failed to update status');
    }
  };

  const handlePrintAppointment = (appointment) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">Appointment Details</h2>
        <hr>
        <p><strong>Appointment ID:</strong> APPT-${appointment.id}</p>
        <p><strong>Patient:</strong> ${appointment.patientName} (${appointment.patientId})</p>
        <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
        <p><strong>Date & Time:</strong> ${appointment.date} at ${appointment.time}</p>
        <p><strong>Type:</strong> ${appointment.type}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
        <p><strong>Room:</strong> ${appointment.room}</p>
        <p><strong>Notes:</strong> ${appointment.notes}</p>
        <hr>
        <p style="margin-top: 30px;">Thank you for choosing our clinic!</p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Appointment ${appointment.id}</title>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    return {
      today: appointments.filter(a => a.date === today).length,
      tomorrow: appointments.filter(a => a.date === tomorrow).length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      total: appointments.length,
      completed: appointments.filter(a => a.status === 'completed').length
    };
  };

  const stats = getStats();
  const timeSlots = getTimeSlots();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600">Schedule, manage, and track patient appointments</p>
          </div>
          <button
            onClick={() => {
              setEditingAppointment(null);
              setFormData({
                patientName: '',
                patientId: '',
                patientAge: '',
                patientGender: 'Male',
                doctorName: '',
                doctorId: '',
                doctorSpecialization: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                time: '',
                duration: '30 mins',
                type: 'regular',
                reason: '',
                notes: '',
                contact: '',
                email: '',
                room: ''
              });
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaCalendarPlus className="mr-2" />
            Schedule Appointment
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Today</h3>
            <p className="text-3xl font-bold text-blue-700">{stats.today}</p>
            <p className="text-sm text-blue-600 mt-2">appointments</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Tomorrow</h3>
            <p className="text-3xl font-bold text-green-700">{stats.tomorrow}</p>
            <p className="text-sm text-green-600 mt-2">scheduled</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-sm text-yellow-600 mt-2">needs confirmation</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-green-700">{stats.confirmed}</p>
            <p className="text-sm text-green-600 mt-2">confirmed</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-purple-700">{stats.completed}</p>
            <p className="text-sm text-purple-600 mt-2">completed</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Total</h3>
            <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-2">appointments</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments by patient, doctor, ID, contact, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Dates</option>
                <option value={format(new Date(), 'yyyy-MM-dd')}>Today</option>
                <option value={format(addDays(new Date(), 1), 'yyyy-MM-dd')}>Tomorrow</option>
                <option value="this-week">This Week</option>
                <option value="next-week">Next Week</option>
              </select>

              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Doctors</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {appointmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Appointment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingAppointment(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Patient Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., P001"
                      />
                      <button
                        type="button"
                        onClick={generatePatientId}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="patient@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3 mt-4">Doctor & Schedule</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Doctor *
                    </label>
                    <select
                      value={formData.doctorId}
                      onChange={(e) => handleDoctorSelect(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {appointmentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="15 mins">15 mins</option>
                      <option value="30 mins">30 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                      <option value="120 mins">120 mins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room
                    </label>
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Room 201"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit *
                    </label>
                    <input
                      type="text"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief reason for appointment"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special notes, symptoms, or requirements..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
                  >
                    <FaSave className="mr-2" />
                    {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAppointment(null);
                    }}
                    className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointment Details View Modal */}
        {viewingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                  <p className="text-gray-600">ID: APPT-{viewingAppointment.id}</p>
                </div>
                <button
                  onClick={() => setViewingAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FaUser className="mr-2" /> Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{viewingAppointment.patientName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">ID</div>
                        <div className="font-medium">{viewingAppointment.patientId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Age/Gender</div>
                        <div className="font-medium">{viewingAppointment.patientAge} / {viewingAppointment.patientGender}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Contact</div>
                      <div className="font-medium">{viewingAppointment.contact}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{viewingAppointment.email}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FaUserMd className="mr-2" /> Doctor & Schedule
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Doctor</div>
                      <div className="font-medium">{viewingAppointment.doctorName}</div>
                      <div className="text-sm text-gray-500">{viewingAppointment.doctorSpecialization}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{viewingAppointment.date}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-medium">{viewingAppointment.time}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{viewingAppointment.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Room</div>
                      <div className="font-medium">{viewingAppointment.room}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FaStethoscope className="mr-2" /> Appointment Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg ${getTypeColor(viewingAppointment.type)}`}>
                      <div className="text-sm font-medium">Type</div>
                      <div className="text-lg font-bold">
                        {appointmentTypes.find(t => t.value === viewingAppointment.type)?.label || viewingAppointment.type}
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${getStatusColor(viewingAppointment.status)}`}>
                      <div className="text-sm font-medium">Status</div>
                      <div className="text-lg font-bold">
                        {statuses.find(s => s.value === viewingAppointment.status)?.label || viewingAppointment.status}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-600">Reason</div>
                      <div className="font-bold text-blue-900">{viewingAppointment.reason}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600">Created</div>
                      <div className="font-bold text-gray-900">{viewingAppointment.createdAt}</div>
                    </div>
                  </div>
                </div>

                {viewingAppointment.notes && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Notes</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{viewingAppointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    startEditing(viewingAppointment);
                    setViewingAppointment(null);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Edit Appointment
                </button>
                <button
                  onClick={() => handlePrintAppointment(viewingAppointment)}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <FaPrint className="mr-2" />
                  Print
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Confirm appointment?')) {
                      handleStatusChange(viewingAppointment.id, 'confirmed');
                      setViewingAppointment(null);
                    }
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <FaCheck className="mr-2" />
                  Confirm
                </button>
                <button
                  onClick={() => setViewingAppointment(null)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Today's Appointments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaCalendarCheck className="mr-2" /> Today's Appointments
            </h2>
            <span className="text-sm text-gray-600">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments
              .filter(a => a.date === format(new Date(), 'yyyy-MM-dd'))
              .slice(0, 3)
              .map(appointment => (
                <div key={appointment.id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaUserMd className="mr-2 text-sm" />
                      <span className="text-sm">{appointment.doctorName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-sm" />
                      <span className="text-sm">{appointment.time} • {appointment.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaStethoscope className="mr-2 text-sm" />
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingAppointment(appointment)}
                    className="w-full mt-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    View Details →
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('patientName')}
                  >
                    <div className="flex items-center">
                      Patient
                      {getSortIcon('patientName')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('doctorName')}
                  >
                    <div className="flex items-center">
                      Doctor
                      {getSortIcon('doctorName')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date & Time
                      {getSortIcon('date')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">{appointment.patientId} • {appointment.patientAge} yrs</div>
                        <div className="text-xs text-gray-500">{appointment.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                      <div className="text-sm text-gray-500">{appointment.doctorSpecialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time} • {appointment.duration}</div>
                      <div className="text-xs text-gray-500">{appointment.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointmentTypes.find(t => t.value === appointment.type)?.label || appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {statuses.find(s => s.value === appointment.status)?.label || appointment.status}
                        </span>
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded"
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingAppointment(appointment)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => startEditing(appointment)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handlePrintAppointment(appointment)}
                          className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50"
                          title="Print"
                        >
                          <FaPrint />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredAppointments.length}</span> of{' '}
                <span className="font-medium">{appointments.length}</span> appointments
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setEditingAppointment(null);
                setFormData({
                  ...formData,
                  type: 'emergency',
                  doctorName: 'Dr. Sarah Wilson',
                  doctorId: 'D001'
                });
                setShowForm(true);
              }}
              className="p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition text-center"
            >
              <FaCalendarPlus className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Emergency Appointment</div>
            </button>
            <button
              onClick={() => {
                setEditingAppointment(null);
                setFormData({
                  ...formData,
                  type: 'follow-up',
                  doctorName: 'Dr. James Davis',
                  doctorId: 'D002'
                });
                setShowForm(true);
              }}
              className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-center"
            >
              <FaCalendarCheck className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Follow-up Appointment</div>
            </button>
            <button
              onClick={() => alert('Bulk scheduling coming soon!')}
              className="p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition text-center"
            >
              <FaCalendarPlus className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Bulk Scheduling</div>
            </button>
            <button
              onClick={() => {
                const pendingAppointments = appointments.filter(a => a.status === 'pending');
                if (pendingAppointments.length > 0) {
                  if (window.confirm(`Confirm all ${pendingAppointments.length} pending appointments?`)) {
                    pendingAppointments.forEach(app => {
                      handleStatusChange(app.id, 'confirmed');
                    });
                    alert('All pending appointments confirmed!');
                  }
                } else {
                  alert('No pending appointments to confirm.');
                }
              }}
              className="p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition text-center"
            >
              <FaCheck className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Confirm All Pending</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;