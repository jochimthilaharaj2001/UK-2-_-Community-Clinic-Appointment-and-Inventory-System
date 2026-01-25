import { useState, useEffect } from 'react';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUserMd,
  FaBriefcaseMedical,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaTimes,
  FaSave,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaClock,
  FaChartBar
} from 'react-icons/fa';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  // Keep the form state as is

  const specializations = [
    'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics', 'Neurology',
    'General Medicine', 'Gynecology', 'Oncology', 'Psychiatry', 'Urology',
    'ENT', 'Ophthalmology', 'Dentistry', 'Physiotherapy'
  ];

  const departments = [
    'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics', 'Neurology',
    'Emergency', 'ICU', 'Radiology', 'Pathology', 'Pharmacy', 'Administration'
  ];

  // Assuming these states are defined elsewhere in the component
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    department: '',
    experience: '',
    schedule: '',
    license: '',
    education: '',
    office: '',
    bio: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewingDoctor, setViewingDoctor] = useState(null);


  useEffect(() => {
    if (editingDoctor) {
      setFormData({
        name: editingDoctor.name,
        specialization: editingDoctor.specialization,
        email: editingDoctor.email,
        phone: editingDoctor.phone,
        department: editingDoctor.department,
        experience: editingDoctor.experience,
        schedule: editingDoctor.schedule,
        license: editingDoctor.license,
        education: editingDoctor.education || '',
        office: editingDoctor.office || '',
        bio: editingDoctor.bio || ''
      });
      setShowForm(true);
    }
  }, [editingDoctor]);

  const filteredDoctors = doctors
    .filter(doctor => {
      const name = doctor.name || '';
      const email = doctor.email || '';
      const specialization = doctor.specialization || '';
      const license = doctor.license || '';

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.includes(searchTerm);
      const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;
      const matchesStatus = statusFilter === 'all' || doctor.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesDepartment = departmentFilter === 'all' || doctor.department === departmentFilter;
      return matchesSearch && matchesSpecialization && matchesStatus && matchesDepartment;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'rating') {
        return sortOrder === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      if (sortBy === 'appointments') {
        return sortOrder === 'asc'
          ? (a.appointments_count || 0) - (b.appointments_count || 0)
          : (b.appointments_count || 0) - (a.appointments_count || 0);
      }
      if (sortBy === 'experience') {
        const expA = parseInt(a.experience);
        const expB = parseInt(b.experience);
        return sortOrder === 'asc' ? expA - expB : expB - expA;
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpecializationColor = (spec) => {
    const colors = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Pediatrics': 'bg-blue-100 text-blue-800',
      'Dermatology': 'bg-purple-100 text-purple-800',
      'Orthopedics': 'bg-green-100 text-green-800',
      'Neurology': 'bg-indigo-100 text-indigo-800',
      'General Medicine': 'bg-teal-100 text-teal-800',
      'Gynecology': 'bg-pink-100 text-pink-800',
      'Oncology': 'bg-orange-100 text-orange-800'
    };
    return colors[spec] || 'bg-gray-100 text-gray-800';
  };

  const getAvailabilityColor = (available) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, editingDoctor ? { ...formData, status: editingDoctor.status } : formData);
        alert('Doctor updated successfully!');
      } else {
        await api.post('/doctors', formData);
        alert('Doctor added successfully!');
      }

      fetchDoctors();
      setShowForm(false);
      setEditingDoctor(null);
      setFormData({
        name: '',
        specialization: '',
        email: '',
        phone: '',
        department: '',
        experience: '',
        schedule: '',
        license: '',
        education: '',
        office: '',
        bio: ''
      });
    } catch (error) {
      console.error('Error saving doctor', error);
      alert('Failed to save doctor. ' + (error.response?.data?.message || ''));
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${doctorId}`);
        setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
        alert('Doctor deleted successfully!');
      } catch (error) {
        console.error('Failed to delete doctor', error);
        alert('Failed to delete doctor');
      }
    }
  };

  const handleStatusChange = async (doctor, newStatus) => {
    try {
      const doctorId = typeof doctor === 'object' ? doctor.id : doctor;
      const doctorData = typeof doctor === 'object' ? doctor : doctors.find(d => d.id === doctorId);

      await api.put(`/doctors/${doctorId}`, { ...doctorData, status: newStatus });
      alert(`Doctor status changed to ${newStatus}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error update status', error);
      alert('Failed to update status');
    }
  };

  const handleToggleAvailability = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      const newStatus = doctor.status === 'active' ? 'on-leave' : 'active';
      handleStatusChange(doctorId, newStatus);
    }
  };

  const generateLicense = () => {
    const randomLicense = 'MED' + Math.floor(100000 + Math.random() * 900000);
    setFormData({ ...formData, license: randomLicense });
  };

  const getStats = () => {
    const total = doctors.length;
    const active = doctors.filter(d => d.status === 'active' || d.status === 'ACTIVE').length;
    const onLeave = doctors.filter(d => d.status === 'on-leave').length;
    const totalAppointments = doctors.reduce((sum, doc) => sum + (Number(doc.appointments_count) || 0), 0);
    const avgRating = total > 0
      ? (doctors.reduce((sum, doc) => sum + (Number(doc.rating) || 0), 0) / total).toFixed(1)
      : '0.0';

    return { total, active, onLeave, totalAppointments, avgRating };
  };

  const stats = getStats();

  const handleUpdateSchedule = (doctorId, newSchedule) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      handleStatusChange({ ...doctor, schedule: newSchedule }, doctor.status);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600">Manage doctor profiles, schedules, and availability</p>
          </div>
          <button
            onClick={() => {
              setEditingDoctor(null);
              setFormData({
                name: '', specialization: '', email: '', phone: '', department: '',
                experience: '', schedule: '', license: '', education: '', office: '', bio: ''
              });
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center shadow-lg transition transform active:scale-95"
          >
            <FaUserPlus className="mr-2" />
            Add New Doctor
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Total Doctors</h3>
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-sm text-blue-600 mt-2">{stats.active} active</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-green-900 mb-2">Avg. Rating</h3>
            <p className="text-3xl font-bold text-green-700">{stats.avgRating}</p>
            <p className="text-sm text-green-600 mt-2">Average doctor rating</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-purple-900 mb-2">Appointments</h3>
            <p className="text-3xl font-bold text-purple-700">{stats.totalAppointments}</p>
            <p className="text-sm text-purple-600 mt-2">This month</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">On Leave</h3>
            <p className="text-3xl font-bold text-yellow-700">{stats.onLeave}</p>
            <p className="text-sm text-yellow-600 mt-2">Currently unavailable</p>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-teal-900 mb-2">Specs</h3>
            <p className="text-3xl font-bold text-teal-700">{specializations.length}</p>
            <p className="text-sm text-teal-600 mt-2">Available areas</p>
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
                  placeholder="Search doctors by name, specialization, email, or license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="all">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Doctor Weekly Schedules</h2>
                  <p className="text-gray-500">Manage recurring shifts and availability patterns</p>
                </div>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <FaTimes className="text-xl text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                        <FaUserMd className="text-2xl text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{doctor.name}</h4>
                        <p className="text-sm font-medium text-blue-600">{doctor.specialization}</p>
                      </div>
                    </div>

                    <div className="flex-1 max-w-md">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-gray-400 text-sm" />
                        <span className="text-sm font-semibold text-gray-700">Recurring Shift</span>
                      </div>
                      <div className="flex gap-3">
                        <select
                          className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                          onChange={(e) => handleUpdateSchedule(doctor.id, e.target.value)}
                          defaultValue={doctor.schedule}
                        >
                          <option value="Mon-Fri, 9AM-5PM">Mon-Fri, 9AM-5PM</option>
                          <option value="Mon-Wed, 8AM-2PM">Mon-Wed, 8AM-2PM</option>
                          <option value="Tue-Thu, 1PM-7PM">Tue-Thu, 1PM-7PM</option>
                          <option value="Weekend Shift">Weekend Shift</option>
                          <option value="Night Shift">Night Shift</option>
                        </select>
                        <button
                          onClick={() => handleStatusChange(doctor, doctor.status === 'active' ? 'on-leave' : 'active')}
                          className={`px-4 py-2 text-sm rounded-xl font-bold transition shadow-sm ${doctor.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                        >
                          {doctor.status === 'active' ? 'Active' : 'On Leave'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg transform active:scale-95"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingDoctor ? 'Edit Profile' : 'New Doctor Profile'}</h2>
                <button onClick={() => { setShowForm(false); setEditingDoctor(null); }} className="text-gray-400 hover:text-gray-600"><FaTimes className="text-xl" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  <select name="specialization" value={formData.specialization} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Specialization</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email" className="w-full px-4 py-2 border rounded-lg" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Phone" className="w-full px-4 py-2 border rounded-lg" />
                  <select name="department" value={formData.department} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} required placeholder="Experience (e.g. 10 years)" className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" name="schedule" value={formData.schedule} onChange={handleInputChange} required placeholder="Initial Schedule" className="w-full px-4 py-2 border rounded-lg" />
                  <div className="flex gap-2">
                    <input type="text" name="license" value={formData.license} onChange={handleInputChange} required placeholder="License #" className="flex-1 px-4 py-2 border rounded-lg" />
                    <button type="button" onClick={generateLicense} className="px-3 bg-gray-100 rounded-lg text-xs font-bold">Auto</button>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition">Save Profile</button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Viewing Modal */}
        {viewingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full translate-y-0 transition-transform">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl shadow-lg font-bold">
                    {viewingDoctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">{viewingDoctor.name}</h2>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getSpecializationColor(viewingDoctor.specialization)}`}>{viewingDoctor.specialization}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(viewingDoctor.status)}`}>{viewingDoctor.status}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setViewingDoctor(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><FaTimes /></button>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600"><FaEnvelope className="text-blue-500" /> <span>{viewingDoctor.email}</span></div>
                  <div className="flex items-center gap-3 text-gray-600"><FaPhone className="text-blue-500" /> <span>{viewingDoctor.phone}</span></div>
                  <div className="flex items-center gap-3 text-gray-600"><FaMapMarkerAlt className="text-blue-500" /> <span>{viewingDoctor.office || 'Main Wing, 2nd Floor'}</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600"><FaBriefcaseMedical className="text-blue-500" /> <span>{viewingDoctor.department}</span></div>
                  <div className="flex items-center gap-3 text-gray-600"><FaCalendarAlt className="text-blue-500" /> <span>{viewingDoctor.schedule}</span></div>
                  <div className="flex items-center gap-3 text-gray-600"><FaGraduationCap className="text-blue-500" /> <span>{viewingDoctor.experience} Exp.</span></div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditingDoctor(viewingDoctor);
                    setViewingDoctor(null);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition"
                >
                  Edit Records
                </button>
                <button
                  onClick={() => handleStatusChange(viewingDoctor, viewingDoctor.status === 'active' ? 'on-leave' : 'active')}
                  className={`flex-1 py-3 font-medium rounded-lg transition shadow-lg ${viewingDoctor.status === 'active'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {viewingDoctor.status === 'active' ? 'Mark as On Leave' : 'Mark as Active'}
                </button>
                <button
                  onClick={() => setViewingDoctor(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition" onClick={() => handleSort('name')}>Doctor {getSortIcon('name')}</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Specialization</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Availability</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest" onClick={() => handleSort('appointments')}>Usage {getSortIcon('appointments')}</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-blue-50/30 transition group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 group-hover:scale-110 transition shadow-sm">
                          {doctor.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{doctor.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{doctor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${getSpecializationColor(doctor.specialization)}`}>{doctor.specialization}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(doctor.status)}`}>{doctor.status}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{doctor.schedule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{doctor.appointments_count || 0} <span className="text-[10px] text-gray-400 font-medium">apps</span></div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map(i => <FaStar key={i} className={`w-2 h-2 ${i <= (doctor.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`} />)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button onClick={() => setViewingDoctor(doctor)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="View Details"><FaEye /></button>
                        <button onClick={() => setEditingDoctor(doctor)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition" title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDelete(doctor.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Delete"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FaChartBar className="text-blue-600" /> Resource Allocation</h3>
            <div className="space-y-5">
              {specializations.slice(0, 5).map(spec => {
                const count = doctors.filter(d => d.specialization === spec).length;
                const percentage = doctors.length ? (count / doctors.length) * 100 : 0;
                return (
                  <div key={spec}>
                    <div className="flex justify-between mb-1.5 font-bold text-xs">
                      <span className="text-gray-700">{spec}</span>
                      <span className="text-blue-600">{count} Doctors</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FaCalendarAlt className="text-purple-600" /> Administrative Panel</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowScheduleModal(true)} className="p-5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl transition group flex flex-col items-center gap-3 border border-purple-100 hover:shadow-lg hover:-translate-y-1 transform">
                <FaClock className="text-3xl group-hover:scale-125 transition duration-300" />
                <span className="font-black text-xs uppercase tracking-widest">Schedules</span>
              </button>
              <button onClick={() => { setEditingDoctor(null); setFormData(p => ({ ...p, specialization: 'Emergency' })); setShowForm(true); }} className="p-5 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl transition group flex flex-col items-center gap-3 border border-red-100 hover:shadow-lg hover:-translate-y-1 transform">
                <FaUserMd className="text-3xl group-hover:scale-125 transition duration-300" />
                <span className="font-black text-xs uppercase tracking-widest">ER On-Call</span>
              </button>
              <button onClick={() => setSpecializationFilter('Cardiology')} className="p-5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl transition group flex flex-col items-center gap-3 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transform">
                <FaBriefcaseMedical className="text-3xl group-hover:scale-125 transition duration-300" />
                <span className="font-black text-xs uppercase tracking-widest">Specialist</span>
              </button>
              <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSpecializationFilter('all'); }} className="p-5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl transition group flex flex-col items-center gap-3 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transform">
                <FaFilter className="text-3xl group-hover:scale-125 transition duration-300" />
                <span className="font-black text-xs uppercase tracking-widest">Reset All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default DoctorManagement;