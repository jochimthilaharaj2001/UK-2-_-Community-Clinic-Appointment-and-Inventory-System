import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaFilter,
  FaPrint,
  FaDownload,
  FaUser,
  FaStethoscope,
  FaPhone,
  FaClock
} from 'react-icons/fa';

const AppointmentsCalendar = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('day'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [doctorsRaw, setDoctorsRaw] = useState([]); // Full doctor objects
  const location = useLocation();

  useEffect(() => {
    fetchDoctors();
    const params = new URLSearchParams(location.search);
    const docParam = params.get('doctor');
    if (docParam) {
      setFilterDoctor(docParam);
    }
  }, [location]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, filterDoctor, filterStatus]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/receptionist/doctors');
      setDoctorsRaw(res.data);
      setDoctorsList(['All Doctors', ...res.data.map(d => d.name)]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let url = `/receptionist/appointments?date=${selectedDate}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus.toLowerCase()}`;
      // In a more advanced filter, you'd add doctor_id, etc.

      const res = await api.get(url);
      setAppointments(res.data.map(app => ({
        id: app.id,
        patientName: app.patient_name,
        time: app.appointment_time.slice(0, 5), // '09:00:00' -> '09:00'
        doctorId: app.doctor_id,
        doctor: app.doctor_name,
        type: app.reason,
        status: app.status.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(app.status.includes('-') ? '-' : ' '),
        room: 'Room ' + (Math.floor(Math.random() * 10) + 101), // Dummy room for now
        date: app.appointment_date.split('T')[0],
        notes: app.notes
      })));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const doctors = doctorsList;

  const statuses = [
    'All Status',
    'Scheduled',
    'Confirmed',
    'Checked-in',
    'In Progress',
    'Completed',
    'Cancelled'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30'
  ];

  const filteredAppointments = appointments.filter(app => {
    const matchesDoctor = filterDoctor === 'all' || app.doctor === filterDoctor;
    const matchesStatus = filterStatus === 'all' || app.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesDoctor && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Checked-in': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckIn = async (appointmentId) => {
    try {
      await api.put(`/receptionist/appointments/${appointmentId}`, {
        status: 'checked-in'
      });
      alert('Patient checked in successfully!');
      fetchAppointments();
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in');
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/receptionist/appointments/${appointmentId}`, {
        status: 'cancelled'
      });
      alert('Appointment cancelled successfully!');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this appointment?')) return;
    try {
      await api.delete(`/receptionist/appointments/${appointmentId}`);
      alert('Appointment deleted successfully!');
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment({
      ...appointment,
      appointment_date: appointment.date,
      appointment_time: appointment.time,
      doctor_id: appointment.doctorId,
      reason: appointment.type
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/receptionist/appointments/${editingAppointment.id}`, {
        appointment_date: editingAppointment.appointment_date,
        appointment_time: editingAppointment.appointment_time,
        doctor_id: editingAppointment.doctor_id,
        reason: editingAppointment.reason,
        notes: editingAppointment.notes
      });
      alert('Appointment updated successfully!');
      setShowEditModal(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleExport = () => {
    if (filteredAppointments.length === 0) {
      alert('No appointments to export');
      return;
    }

    const headers = ['Time', 'Patient', 'Doctor', 'Type', 'Status', 'Room'];
    const csvRows = [
      headers.join(','),
      ...filteredAppointments.map(app => [
        `"${app.time}"`,
        `"${app.patientName}"`,
        `"${app.doctor}"`,
        `"${app.type}"`,
        `"${app.status}"`,
        `"${app.room}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `appointments_${selectedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintSchedule = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Appointment Schedule - ${selectedDate}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Clinic Appointment Schedule</h2>
          <h3>Date: ${selectedDate}</h3>
          <hr>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #ddd; padding: 8px;">Time</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Patient</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Doctor</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Type</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAppointments.map(app => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${app.time}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${app.patientName}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${app.doctor}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${app.type}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${app.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <hr>
          <p style="margin-top: 30px;"><strong>Total Appointments:</strong> ${filteredAppointments.length}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/receptionist/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments Calendar</h1>
          <p className="text-gray-600 mt-2">View and manage all appointments</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/receptionist/book-appointment')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            New Appointment
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-md capitalize ${view === v
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-gray-200'
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Date Selector */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Export Options */}
            <button
              onClick={handlePrintSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <FaPrint />
              Print
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <FaDownload />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FaFilter />
                Filter by Doctor
              </div>
            </label>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {doctors.map(doctor => (
                <option key={doctor} value={doctor === 'All Doctors' ? 'all' : doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All Status' ? 'all' : status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Actions
            </label>
            <div className="flex gap-2">
              <button
                onClick={setToday}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
              >
                Today
              </button>
              <button
                onClick={setTomorrow}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                Tomorrow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Calendar Header */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {view === 'day' ? 'Daily Schedule' :
                view === 'week' ? 'Weekly Schedule' : 'Monthly Schedule'}
            </h2>
            <div className="text-gray-600">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="divide-y divide-gray-200">
          {view === 'day' ? (
            // Day View
            <div>
              {timeSlots.map(timeSlot => {
                const appointmentForSlot = filteredAppointments.find(
                  app => app.time === timeSlot
                );

                return (
                  <div key={timeSlot} className="flex border-b">
                    <div className="w-32 p-4 border-r bg-gray-50">
                      <div className="font-medium text-gray-900">{timeSlot}</div>
                    </div>

                    <div className="flex-1 p-4 min-h-16">
                      {appointmentForSlot ? (
                        <div className={`p-4 rounded-lg ${appointmentForSlot.status === 'Checked-in' ? 'bg-yellow-50 border border-yellow-200' :
                          appointmentForSlot.status === 'Confirmed' ? 'bg-green-50 border border-green-200' :
                            'bg-blue-50 border border-blue-200'
                          }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <FaUser className="text-gray-400" />
                                <span className="font-bold text-gray-900">{appointmentForSlot.patientName}</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FaStethoscope />
                                  <span>{appointmentForSlot.doctor}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>{appointmentForSlot.type}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>{appointmentForSlot.room}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointmentForSlot.status)}`}>
                                {appointmentForSlot.status}
                              </span>
                              <div className="flex gap-2">
                                {appointmentForSlot.status !== 'Cancelled' && appointmentForSlot.status !== 'Completed' && (
                                  <>
                                    {appointmentForSlot.status !== 'Checked-in' && (
                                      <button
                                        onClick={() => handleCheckIn(appointmentForSlot.id)}
                                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200"
                                      >
                                        Check-in
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleCancel(appointmentForSlot.id)}
                                      className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleEdit(appointmentForSlot)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(appointmentForSlot.id)}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">No appointment scheduled</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Table View for Week/Month
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Time</th>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Patient</th>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Doctor</th>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Type</th>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Status</th>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Room</th>
                    <th className="py-3 px-6 text-left text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map(appointment => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          <span className="font-medium">{appointment.patientName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FaStethoscope className="text-gray-400" />
                          <span>{appointment.doctor}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {appointment.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {appointment.room}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {appointment.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCheckIn(appointment.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200"
                            >
                              Check-in
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</div>
          <div className="text-gray-600">Total Appointments</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredAppointments.filter(a => a.status === 'Confirmed').length}
          </div>
          <div className="text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredAppointments.filter(a => a.status === 'Checked-in').length}
          </div>
          <div className="text-gray-600">Checked-in</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredAppointments.filter(a => a.status === 'Cancelled').length}
          </div>
          <div className="text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <div className="mt-8 text-center py-12">
          <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 mb-6">Try changing your filters or book a new appointment</p>
          <button
            onClick={() => navigate('/receptionist/book-appointment')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Book New Appointment
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <input type="text" value={editingAppointment.patientName} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <select
                    value={editingAppointment.doctor_id}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, doctor_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {doctorsRaw.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editingAppointment.appointment_date}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, appointment_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select
                    value={editingAppointment.appointment_time}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, appointment_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason/Type</label>
                <input
                  type="text"
                  value={editingAppointment.reason}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editingAppointment.notes || ''}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                  Update Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsCalendar;
