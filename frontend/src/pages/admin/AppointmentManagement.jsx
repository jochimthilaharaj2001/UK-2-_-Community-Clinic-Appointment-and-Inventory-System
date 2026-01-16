import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaCalendarPlus, FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      patientName: 'John Smith', 
      patientId: 'P001', 
      doctorName: 'Dr. Sarah Wilson',
      doctorId: 'D001',
      date: '2024-01-15', 
      time: '09:00 AM',
      status: 'confirmed',
      type: 'regular',
      notes: 'Follow-up appointment',
      contact: '+1234567890'
    },
    { 
      id: 2, 
      patientName: 'Emily Johnson', 
      patientId: 'P002', 
      doctorName: 'Dr. James Davis',
      doctorId: 'D002',
      date: '2024-01-15', 
      time: '10:30 AM',
      status: 'pending',
      type: 'emergency',
      notes: 'High fever consultation',
      contact: '+1234567891'
    },
    { 
      id: 3, 
      patientName: 'Michael Brown', 
      patientId: 'P003', 
      doctorName: 'Dr. Robert Chen',
      doctorId: 'D003',
      date: '2024-01-15', 
      time: '02:00 PM',
      status: 'confirmed',
      type: 'regular',
      notes: 'Annual checkup',
      contact: '+1234567892'
    },
    { 
      id: 4, 
      patientName: 'Sarah Miller', 
      patientId: 'P004', 
      doctorName: 'Dr. Lisa Garcia',
      doctorId: 'D004',
      date: '2024-01-16', 
      time: '11:00 AM',
      status: 'cancelled',
      type: 'consultation',
      notes: 'Dental consultation',
      contact: '+1234567893'
    },
    { 
      id: 5, 
      patientName: 'David Wilson', 
      patientId: 'P005', 
      doctorName: 'Dr. Sarah Wilson',
      doctorId: 'D001',
      date: '2024-01-16', 
      time: '03:30 PM',
      status: 'confirmed',
      type: 'follow-up',
      notes: 'Post-surgery check',
      contact: '+1234567894'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'regular',
    notes: ''
  });

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDate = dateFilter === 'all' || app.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'regular': return 'bg-green-100 text-green-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      case 'consultation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: appointments.length + 1,
      ...formData,
      patientId: `P00${appointments.length + 1}`,
      doctorId: `D00${appointments.length + 1}`,
      status: 'pending',
      contact: '+1234567890'
    };
    setAppointments([...appointments, newAppointment]);
    setShowForm(false);
    setFormData({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: 'regular',
      notes: ''
    });
    alert('Appointment scheduled successfully!');
  };

  const handleStatusUpdate = (id, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    alert(`Appointment status updated to ${newStatus}`);
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600">Schedule and manage patient appointments</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaCalendarPlus className="mr-2" />
            Schedule Appointment
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments by patient, doctor, or ID..."
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
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Dates</option>
                <option value={today}>Today</option>
                <option value={tomorrow}>Tomorrow</option>
                <option value="2024-01-15">Jan 15, 2024</option>
                <option value="2024-01-16">Jan 16, 2024</option>
              </select>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Appointment</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
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
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter doctor name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="regular">Regular Checkup</option>
                      <option value="emergency">Emergency</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="consultation">Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special notes..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    Schedule Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">{appointment.patientId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                      <div className="text-sm text-gray-500">{appointment.doctorId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {appointment.status === 'pending' && (
                          <select
                            onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                            className="text-xs border rounded px-1 py-1"
                          >
                            <option value="">Update</option>
                            <option value="confirmed">Confirm</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`Viewing appointment details for ${appointment.patientName}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => alert(`Editing appointment for ${appointment.patientName}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this appointment?')) {
                              setAppointments(appointments.filter(a => a.id !== appointment.id));
                              alert('Appointment deleted successfully');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
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
                Showing <span className="font-medium">{filteredAppointments.length}</span> of <span className="font-medium">{appointments.length}</span> appointments
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                Previous
              </button>
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Today's Appointments</h3>
            <p className="text-3xl font-bold text-blue-700">
              {appointments.filter(a => a.date === today).length}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {appointments.filter(a => a.date === today && a.status === 'confirmed').length} confirmed
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Pending Confirmation</h3>
            <p className="text-3xl font-bold text-green-700">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-sm text-green-600 mt-2">
              Needs immediate attention
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">Appointment Types</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Regular Checkups</span>
                <span className="font-medium">{appointments.filter(a => a.type === 'regular').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Emergency</span>
                <span className="font-medium">{appointments.filter(a => a.type === 'emergency').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;