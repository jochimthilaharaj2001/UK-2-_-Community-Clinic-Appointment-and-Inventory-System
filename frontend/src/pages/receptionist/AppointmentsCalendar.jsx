// pages/receptionist/AppointmentsCalendar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaFilter,
  FaPrint,
  FaDownload,
  FaUser,
  FaStethoscope,
  FaPhone,
  FaClock,
  FaCalendarPlus,
  FaEye
} from 'react-icons/fa';

const AppointmentsCalendar = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('day'); // 'day', 'week', 'month'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const doctors = [
    { id: 'all', name: 'All Doctors' },
    { id: 'dr1', name: 'Dr. Sarah Wilson', department: 'Cardiology' },
    { id: 'dr2', name: 'Dr. Michael Chen', department: 'General Medicine' },
    { id: 'dr3', name: 'Dr. Lisa Park', department: 'Pediatrics' },
    { id: 'dr4', name: 'Dr. James Lee', department: 'Orthopedics' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'scheduled', name: 'Scheduled', color: 'blue' },
    { id: 'confirmed', name: 'Confirmed', color: 'green' },
    { id: 'checked-in', name: 'Checked-in', color: 'yellow' },
    { id: 'in-progress', name: 'In Progress', color: 'purple' },
    { id: 'completed', name: 'Completed', color: 'gray' },
    { id: 'cancelled', name: 'Cancelled', color: 'red' }
  ];

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];

  const appointments = [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'PAT001',
      time: '09:00 AM',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      type: 'Follow-up',
      status: 'scheduled',
      room: 'Room 101',
      contact: '+1 (234) 567-8901',
      notes: 'Regular blood pressure check'
    },
    {
      id: 2,
      patientName: 'Emily Johnson',
      patientId: 'PAT002',
      time: '10:30 AM',
      doctor: 'Dr. Michael Chen',
      department: 'General Medicine',
      type: 'Consultation',
      status: 'confirmed',
      room: 'Room 102',
      contact: '+1 (234) 567-8902',
      notes: 'Diabetes management review'
    },
    {
      id: 3,
      patientName: 'Michael Brown',
      patientId: 'PAT003',
      time: '11:00 AM',
      doctor: 'Dr. Lisa Park',
      department: 'Pediatrics',
      type: 'New Patient',
      status: 'checked-in',
      room: 'Room 103',
      contact: '+1 (234) 567-8903',
      notes: 'Child vaccination'
    },
    {
      id: 4,
      patientName: 'Sarah Miller',
      patientId: 'PAT004',
      time: '02:00 PM',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      type: 'Check-up',
      status: 'scheduled',
      room: 'Room 101',
      contact: '+1 (234) 567-8904',
      notes: 'Annual heart check'
    },
    {
      id: 5,
      patientName: 'David Wilson',
      patientId: 'PAT005',
      time: '03:30 PM',
      doctor: 'Dr. James Lee',
      department: 'Orthopedics',
      type: 'Procedure',
      status: 'confirmed',
      room: 'Room 104',
      contact: '+1 (234) 567-8905',
      notes: 'Knee examination'
    },
  ];

  const filteredAppointments = appointments.filter(app => {
    const matchesDoctor = filterDoctor === 'all' || app.doctor === filterDoctor;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesDoctor && matchesStatus;
  });

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.id === status);
    if (!statusObj) return 'bg-gray-100 text-gray-800';

    switch (statusObj.color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'gray': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckIn = (appointmentId) => {
    // In real app, this would update appointment status
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      alert(`Checked in ${appointment.patientName} for appointment at ${appointment.time}`);
    }
  };

  const handlePrintSchedule = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Appointment Schedule - ${selectedDate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #333; }
            .date { color: #666; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .status-scheduled { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; }
            .status-confirmed { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; }
            .status-checkedin { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="clinic-name">Community Clinic System</div>
            <h2>Appointment Schedule</h2>
            <div class="date">Date: ${selectedDate}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient (ID)</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAppointments.map(app => `
                <tr>
                  <td>${app.time}</td>
                  <td>${app.patientName} (${app.patientId})</td>
                  <td>${app.doctor}</td>
                  <td>${app.department}</td>
                  <td>${app.type}</td>
                  <td><span class="status-${app.status}">${app.status}</span></td>
                  <td>${app.room}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p><strong>Total Appointments:</strong> ${filteredAppointments.length}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p>Clinic Receptionist Portal</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportCSV = () => {
    if (filteredAppointments.length === 0) {
      alert('No appointments to export');
      return;
    }

    const headers = ['Time', 'Patient Name', 'Patient ID', 'Doctor', 'Department', 'Type', 'Status', 'Room', 'Contact', 'Notes'];
    const csvData = filteredAppointments.map(app => [
      `"${app.time}"`,
      `"${app.patientName}"`,
      `"${app.patientId}"`,
      `"${app.doctor}"`,
      `"${app.department}"`,
      `"${app.type}"`,
      `"${app.status}"`,
      `"${app.room}"`,
      `"${app.contact}"`,
      `"${app.notes || ''}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleViewTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleViewNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek.toISOString().split('T')[0]);
  };

  const getStatusCount = (statusId) => {
    return filteredAppointments.filter(app => app.status === statusId).length;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments Calendar</h1>
            <p className="text-gray-600 mt-2">View and manage patient appointments</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">

            <button
              onClick={handleExportCSV}
              className="px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center">
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Doctor Filter */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id === 'all' ? 'all' : doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calendar View
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['day', 'week', 'month'].map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex-1 px-4 py-2 rounded-md capitalize text-sm font-medium transition-colors ${view === v
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</div>
            <div className="text-sm text-gray-600">Total Appointments</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {getStatusCount('confirmed') + getStatusCount('checked-in')}
            </div>
            <div className="text-sm text-gray-600">Active Today</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {getStatusCount('scheduled')}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="text-2xl font-bold text-red-600">
              {getStatusCount('cancelled')}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
                {view === 'day' ? 'Daily Schedule' :
                  view === 'week' ? 'Weekly Schedule' :
                    'Monthly Schedule'}
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-gray-600">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <button
                  onClick={handlePrintSchedule}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center text-sm"
                >
                  <FaPrint className="mr-2" />
                  Print Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Time Slots Grid - Day View */}
          {view === 'day' && (
            <div className="divide-y divide-gray-100">
              {timeSlots.map(timeSlot => {
                const appointmentForSlot = filteredAppointments.find(
                  app => app.time === timeSlot
                );

                return (
                  <div key={timeSlot} className="flex hover:bg-gray-50 transition-colors">
                    {/* Time Column */}
                    <div className="w-32 p-4 border-r bg-gray-50">
                      <div className="font-bold text-gray-900">{timeSlot}</div>
                      <div className="text-xs text-gray-500 mt-1">30 min</div>
                    </div>

                    {/* Appointment Slot */}
                    <div className="flex-1 p-4 min-h-20">
                      {appointmentForSlot ? (
                        <div className={`p-4 rounded-xl border-l-4 ${appointmentForSlot.status === 'checked-in' ? 'border-l-yellow-500 bg-yellow-50' :
                          appointmentForSlot.status === 'confirmed' ? 'border-l-green-500 bg-green-50' :
                            appointmentForSlot.status === 'scheduled' ? 'border-l-blue-500 bg-blue-50' :
                              'border-l-gray-500 bg-gray-50'
                          }`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-3 md:mb-0">
                              <div className="flex items-center gap-2 mb-1">
                                <FaUser className="text-gray-400" />
                                <span className="font-bold text-gray-900">{appointmentForSlot.patientName}</span>
                                <span className="text-sm text-gray-500">({appointmentForSlot.patientId})</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 ml-6">
                                <div className="flex items-center gap-1">
                                  <FaStethoscope />
                                  <span>{appointmentForSlot.doctor}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span>{appointmentForSlot.department}</span>
                                <span className="text-gray-400">•</span>
                                <span>{appointmentForSlot.room}</span>
                              </div>
                              {appointmentForSlot.notes && (
                                <p className="text-sm text-gray-500 mt-2 ml-6">{appointmentForSlot.notes}</p>
                              )}
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointmentForSlot.status)}`}>
                                {statuses.find(s => s.id === appointmentForSlot.status)?.name || appointmentForSlot.status}
                              </span>
                              <div className="flex gap-2">
                                {appointmentForSlot.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleCheckIn(appointmentForSlot.id)}
                                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg"
                                  >
                                    Check-in
                                  </button>
                                )}
                                <button
                                  onClick={() => navigate(`/receptionist/appointments/${appointmentForSlot.id}`)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center"
                                >
                                  <FaEye className="mr-1" /> View
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg">
                                  <FaPhone />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic pl-4">Available slot</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View for Week/Month */}
          {(view === 'week' || view === 'month') && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Time</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Patient Details</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Doctor</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAppointments.map(appointment => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{appointment.time}</div>
                            <div className="text-xs text-gray-500">{appointment.room}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.patientId}</div>
                          <div className="text-xs text-gray-400">{appointment.contact}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{appointment.doctor}</div>
                          <div className="text-sm text-gray-500">{appointment.department}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {appointment.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {statuses.find(s => s.id === appointment.status)?.name || appointment.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => handleCheckIn(appointment.id)}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg"
                            >
                              Check-in
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/receptionist/appointments/${appointment.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => window.location.href = `tel:${appointment.contact}`}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                            title="Call Patient"
                          >
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

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border p-12 text-center">
            <FaCalendarAlt className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No appointments are scheduled for {selectedDate} with the current filters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setFilterDoctor('all');
                  setFilterStatus('all');
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Clear Filters
              </button>
              <button
                onClick={() => navigate('/receptionist/appointments/new')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
              >
                Schedule New Appointment
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} for {selectedDate}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleViewToday}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              View Today
            </button>
            <button
              onClick={handleViewTomorrow}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm"
            >
              View Tomorrow
            </button>
            <button
              onClick={handleViewNextWeek}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm"
            >
              Next Week
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsCalendar;