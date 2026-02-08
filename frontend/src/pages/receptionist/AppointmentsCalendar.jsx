// pages/receptionist/AppointmentsCalendar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, filterDoctor, filterStatus]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/receptionist/doctors');
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
        time: app.appointment_time,
        doctor: app.doctor_name,
        type: app.reason,
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        room: 'Room ' + (Math.floor(Math.random() * 10) + 101) // Dummy room for now
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
    '11:00', '11:30', '01:00', '01:30',
    '02:00', '02:30', '03:00', '03:30',
    '04:00', '04:30'
  ];

  const filteredAppointments = appointments.filter(app => {
    const matchesDoctor = filterDoctor === 'all' || app.doctor === filterDoctor;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
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
                                <button
                                  onClick={() => handleCheckIn(appointmentForSlot.id)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                                >
                                  Check-in
                                </button>
                                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                                  Call
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
                          <button
                            onClick={() => handleCheckIn(appointment.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                          >
                            Check-in
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                            <FaPhone />
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
    </div>
  );
};

export default AppointmentsCalendar;
