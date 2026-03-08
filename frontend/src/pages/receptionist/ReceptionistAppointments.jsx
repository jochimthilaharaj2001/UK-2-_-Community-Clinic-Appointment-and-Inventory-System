import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarCheck,
  FaUserMd,
  FaClock,
  FaCheck,
  FaTimes,
  FaFilter
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptRes, doctorRes] = await Promise.all([
        api.get('/receptionist/appointments'),
        api.get('/receptionist/doctors')
      ]);
      setAppointments(apptRes.data);
      setDoctors(doctorRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/receptionist/appointments/${id}`, { status: newStatus });
      toast.success(`Appointment ${newStatus} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this appointment?')) return;
    try {
      await api.delete(`/receptionist/appointments/${id}`);
      toast.success('Appointment deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment({
      ...appointment,
      appointment_date: appointment.appointment_date.split('T')[0],
      appointment_time: appointment.appointment_time.slice(0, 5),
      doctor_id: appointment.doctor_id,
      reason: appointment.reason || '',
      notes: appointment.notes || ''
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
      toast.success('Appointment updated');
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.reason && app.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-amber-500 pl-4">Appointment Management</h1>
            <p className="text-gray-600 mt-1 ml-5">Manage and track all patient schedules</p>
          </div>
          <button
            onClick={() => window.location.href = '/receptionist/book-appointment'}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-200 transition-all active:scale-95"
          >
            <FaPlus /> Book New Appointment
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all outline-none appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-in</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-sm font-medium">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex justify-center flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading appointments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaCalendarCheck size={48} className="text-gray-200" />
                      <p className="font-medium">No appointments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{app.patient_name}</div>
                      <div className="text-xs text-gray-500">{app.patient_phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{app.doctor_name}</div>
                      <div className="text-xs text-amber-600">{app.doctor_specialization}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{new Date(app.appointment_date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FaClock size={10} /> {app.appointment_time.slice(0, 5)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 truncate max-w-[150px] inline-block">
                        {app.reason || 'Routine checkup'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {app.status === 'scheduled' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                            title="Confirm"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {app.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(app)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium">
                    {editingAppointment.patient_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
                  <select
                    value={editingAppointment.doctor_id}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, doctor_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {doctors.map(doc => (
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={editingAppointment.appointment_time}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, appointment_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  value={editingAppointment.reason}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, reason: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editingAppointment.notes}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-100 transition-all active:scale-95">
                  Update Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
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

export default ReceptionistAppointments;
