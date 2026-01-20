import { useState, useEffect } from 'react';
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
  FaSortDown
} from 'react-icons/fa';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([
    { 
      id: 1, 
      name: 'Dr. Sarah Wilson', 
      specialization: 'Cardiology', 
      email: 'sarah@hospital.com',
      phone: '+1234567890',
      department: 'Cardiology',
      status: 'active',
      experience: '10 years',
      rating: 4.8,
      appointments: 156,
      schedule: 'Mon-Fri, 9AM-5PM',
      license: 'MED123456',
      education: 'MD, Cardiology, Harvard Medical School',
      office: 'Room 201, Cardiology Wing',
      bio: 'Senior Cardiologist with 10+ years of experience in heart diseases and treatment.',
      available: true
    },
    { 
      id: 2, 
      name: 'Dr. James Davis', 
      specialization: 'Pediatrics', 
      email: 'james@hospital.com',
      phone: '+1234567891',
      department: 'Pediatrics',
      status: 'active',
      experience: '8 years',
      rating: 4.6,
      appointments: 132,
      schedule: 'Mon-Sat, 10AM-6PM',
      license: 'MED123457',
      education: 'MD, Pediatrics, Johns Hopkins University',
      office: 'Room 105, Pediatric Wing',
      bio: 'Specialized in child healthcare and development disorders.',
      available: true
    },
    { 
      id: 3, 
      name: 'Dr. Lisa Garcia', 
      specialization: 'Dermatology', 
      email: 'lisa@hospital.com',
      phone: '+1234567892',
      department: 'Dermatology',
      status: 'on-leave',
      experience: '12 years',
      rating: 4.9,
      appointments: 98,
      schedule: 'Tue-Thu, 8AM-4PM',
      license: 'MED123458',
      education: 'MD, Dermatology, Stanford University',
      office: 'Room 308, Dermatology Wing',
      bio: 'Expert in skin diseases, cosmetic dermatology, and laser treatments.',
      available: false
    },
    { 
      id: 4, 
      name: 'Dr. Robert Chen', 
      specialization: 'Orthopedics', 
      email: 'robert@hospital.com',
      phone: '+1234567893',
      department: 'Orthopedics',
      status: 'active',
      experience: '15 years',
      rating: 4.7,
      appointments: 178,
      schedule: 'Mon-Fri, 8AM-6PM',
      license: 'MED123459',
      education: 'MD, Orthopedic Surgery, Mayo Clinic',
      office: 'Room 401, Orthopedics Wing',
      bio: 'Orthopedic surgeon specialized in joint replacement and sports injuries.',
      available: true
    },
    { 
      id: 5, 
      name: 'Dr. Emma Thompson', 
      specialization: 'Neurology', 
      email: 'emma@hospital.com',
      phone: '+1234567894',
      department: 'Neurology',
      status: 'active',
      experience: '7 years',
      rating: 4.5,
      appointments: 121,
      schedule: 'Wed-Fri, 9AM-5PM',
      license: 'MED123460',
      education: 'MD, Neurology, Yale School of Medicine',
      office: 'Room 502, Neurology Wing',
      bio: 'Neurologist specializing in migraine, epilepsy, and neurological disorders.',
      available: true
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);
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

  const specializations = [
    'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics', 'Neurology',
    'General Medicine', 'Gynecology', 'Oncology', 'Psychiatry', 'Urology',
    'ENT', 'Ophthalmology', 'Dentistry', 'Physiotherapy'
  ];

  const departments = [
    'Cardiology', 'Pediatrics', 'Dermatology', 'Orthopedics', 'Neurology',
    'Emergency', 'ICU', 'Radiology', 'Pathology', 'Pharmacy', 'Administration'
  ];

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
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.license.includes(searchTerm);
      const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;
      const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
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
          ? a.appointments - b.appointments
          : b.appointments - a.appointments;
      }
      if (sortBy === 'experience') {
        const expA = parseInt(a.experience);
        const expB = parseInt(b.experience);
        return sortOrder === 'asc' ? expA - expB : expB - expA;
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch(status) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingDoctor) {
      // Update existing doctor
      const updatedDoctor = {
        ...editingDoctor,
        ...formData,
        appointments: editingDoctor.appointments,
        rating: editingDoctor.rating,
        available: editingDoctor.status === 'active'
      };
      
      setDoctors(doctors.map(doctor => 
        doctor.id === editingDoctor.id ? updatedDoctor : doctor
      ));
      alert('Doctor updated successfully!');
    } else {
      // Add new doctor
      const newDoctor = {
        id: doctors.length + 1,
        ...formData,
        status: 'active',
        rating: 4.5,
        appointments: 0,
        available: true,
        license: formData.license || `MED${100000 + doctors.length + 1}`
      };
      
      setDoctors([...doctors, newDoctor]);
      alert('Doctor added successfully!');
    }
    
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
  };

  const handleDelete = (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      alert('Doctor deleted successfully!');
    }
  };

  const handleStatusChange = (doctorId, newStatus) => {
    setDoctors(doctors.map(doctor => 
      doctor.id === doctorId 
        ? { 
            ...doctor, 
            status: newStatus,
            available: newStatus === 'active'
          } 
        : doctor
    ));
    alert(`Doctor status changed to ${newStatus}`);
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
    setFormData({...formData, license: randomLicense});
  };

  const getStats = () => {
    const total = doctors.length;
    const active = doctors.filter(d => d.status === 'active').length;
    const onLeave = doctors.filter(d => d.status === 'on-leave').length;
    const totalAppointments = doctors.reduce((sum, doc) => sum + doc.appointments, 0);
    const avgRating = (doctors.reduce((sum, doc) => sum + doc.rating, 0) / total).toFixed(1);
    
    return { total, active, onLeave, totalAppointments, avgRating };
  };

  const stats = getStats();

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
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Add New Doctor
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Total Doctors</h3>
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-sm text-blue-600 mt-2">
              {stats.active} active
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Avg. Rating</h3>
            <p className="text-3xl font-bold text-green-700">{stats.avgRating}</p>
            <p className="text-sm text-green-600 mt-2">Average doctor rating</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">Total Appointments</h3>
            <p className="text-3xl font-bold text-purple-700">{stats.totalAppointments}</p>
            <p className="text-sm text-purple-600 mt-2">This month</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">On Leave</h3>
            <p className="text-3xl font-bold text-yellow-700">{stats.onLeave}</p>
            <p className="text-sm text-yellow-600 mt-2">Currently unavailable</p>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-teal-900 mb-2">Specializations</h3>
            <p className="text-3xl font-bold text-teal-700">{specializations.length}</p>
            <p className="text-sm text-teal-600 mt-2">Available specializations</p>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on-leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Doctor Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoctor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dr. Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="doctor@hospital.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5 years"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule *
                    </label>
                    <input
                      type="text"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mon-Fri, 9AM-5PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical License *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., MED123456"
                      />
                      <button
                        type="button"
                        onClick={generateLicense}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MD, Cardiology, Harvard Medical School"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office Location
                    </label>
                    <input
                      type="text"
                      name="office"
                      value={formData.office}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Room 201, Cardiology Wing"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biography
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief professional biography..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
                  >
                    <FaSave className="mr-2" />
                    {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDoctor(null);
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

        {/* Doctor Details View Modal */}
        {viewingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUserMd className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{viewingDoctor.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 text-sm font-medium rounded-full ${getSpecializationColor(viewingDoctor.specialization)}`}>
                        {viewingDoctor.specialization}
                      </span>
                      <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(viewingDoctor.status)}`}>
                        {viewingDoctor.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingDoctor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{viewingDoctor.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{viewingDoctor.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Office</div>
                        <div className="font-medium">{viewingDoctor.office}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Professional Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaBriefcaseMedical className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Department</div>
                        <div className="font-medium">{viewingDoctor.department}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Schedule</div>
                        <div className="font-medium">{viewingDoctor.schedule}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaGraduationCap className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Experience</div>
                        <div className="font-medium">{viewingDoctor.experience}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-900 mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{viewingDoctor.rating}</div>
                      <div className="text-sm text-blue-600">Rating</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{viewingDoctor.appointments}</div>
                      <div className="text-sm text-green-600">Appointments</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">{viewingDoctor.license}</div>
                      <div className="text-sm text-purple-600">License</div>
                    </div>
                    <div className={`p-4 rounded-lg ${getAvailabilityColor(viewingDoctor.available)}`}>
                      <div className="text-2xl font-bold">
                        {viewingDoctor.available ? 'Available' : 'Unavailable'}
                      </div>
                      <div className="text-sm">Status</div>
                    </div>
                  </div>
                </div>

                {viewingDoctor.education && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Education</h3>
                    <p className="text-gray-700">{viewingDoctor.education}</p>
                  </div>
                )}

                {viewingDoctor.bio && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Biography</h3>
                    <p className="text-gray-700">{viewingDoctor.bio}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditingDoctor(viewingDoctor);
                    setViewingDoctor(null);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Edit Doctor
                </button>
                <button
                  onClick={() => handleToggleAvailability(viewingDoctor.id)}
                  className={`flex-1 py-3 font-medium rounded-lg ${
                    viewingDoctor.available
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {viewingDoctor.available ? 'Mark as On Leave' : 'Mark as Active'}
                </button>
                <button
                  onClick={() => setViewingDoctor(null)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Doctors Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doctors.slice(0, 3).map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSpecializationColor(doctor.specialization)}`}>
                      {doctor.specialization}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-bold">{doctor.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-sm" />
                  <span className="text-sm truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-sm" />
                  <span className="text-sm">{doctor.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaBriefcaseMedical className="mr-2 text-sm" />
                  <span className="text-sm">{doctor.department}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{doctor.experience}</span>
                <button
                  onClick={() => setViewingDoctor(doctor)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Doctor
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('appointments')}
                  >
                    <div className="flex items-center">
                      Appointments
                      {getSortIcon('appointments')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUserMd className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.email}</div>
                      <div className="text-sm text-gray-500">{doctor.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSpecializationColor(doctor.specialization)}`}>
                          {doctor.specialization}
                        </span>
                        <span className="text-xs text-gray-500">{doctor.experience}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">{doctor.schedule}</span>
                        <button
                          onClick={() => handleToggleAvailability(doctor.id)}
                          className={`text-xs px-2 py-1 rounded w-full ${
                            doctor.available
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {doctor.available ? 'Mark as On Leave' : 'Mark as Active'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{doctor.appointments}</div>
                        <div className="text-xs text-gray-500">This month</div>
                        <div className="flex items-center justify-center mt-1">
                          <FaStar className="text-yellow-500 w-3 h-3 mr-1" />
                          <span className="text-xs">{doctor.rating}/5</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingDoctor(doctor)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setEditingDoctor(doctor)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
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
                Showing <span className="font-medium">{filteredDoctors.length}</span> of{' '}
                <span className="font-medium">{doctors.length}</span> doctors
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
                setEditingDoctor(null);
                setFormData({
                  ...formData,
                  specialization: 'Cardiology',
                  department: 'Cardiology'
                });
                setShowForm(true);
              }}
              className="p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition text-center"
            >
              <FaUserMd className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Add Cardiologist</div>
            </button>
            <button
              onClick={() => {
                setEditingDoctor(null);
                setFormData({
                  ...formData,
                  specialization: 'Pediatrics',
                  department: 'Pediatrics'
                });
                setShowForm(true);
              }}
              className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-center"
            >
              <FaUserMd className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Add Pediatrician</div>
            </button>
            <button
              onClick={() => {
                setEditingDoctor(null);
                setFormData({
                  ...formData,
                  specialization: 'General Medicine',
                  department: 'Emergency'
                });
                setShowForm(true);
              }}
              className="p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition text-center"
            >
              <FaUserMd className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Add General Physician</div>
            </button>
            <button
              onClick={() => alert('Schedule management coming soon!')}
              className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition text-center"
            >
              <FaCalendarAlt className="text-2xl mx-auto mb-2" />
              <div className="font-medium">Manage Schedules</div>
            </button>
          </div>
        </div>

        {/* Specialization Distribution */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Specialization Distribution</h3>
          <div className="space-y-3">
            {specializations.map(spec => {
              const count = doctors.filter(d => d.specialization === spec).length;
              if (count === 0) return null;
              
              const percentage = (count / doctors.length) * 100;
              return (
                <div key={spec} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{spec}</span>
                    <span className="text-sm text-gray-500">{count} doctors ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;