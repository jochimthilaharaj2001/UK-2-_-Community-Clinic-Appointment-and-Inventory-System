import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaEye, FaStar, FaPhone, FaEnvelope } from 'react-icons/fa';

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
      license: 'MED123456'
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
      license: 'MED123457'
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
      license: 'MED123458'
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
      license: 'MED123459'
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
      license: 'MED123460'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    department: '',
    experience: '',
    schedule: ''
  });

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
    return matchesSearch && matchesSpecialization && matchesStatus;
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
      'Neurology': 'bg-indigo-100 text-indigo-800'
    };
    return colors[spec] || 'bg-gray-100 text-gray-800';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDoctor = {
      id: doctors.length + 1,
      ...formData,
      status: 'active',
      rating: 4.5,
      appointments: 0,
      license: `MED${100000 + doctors.length + 1}`
    };
    setDoctors([...doctors, newDoctor]);
    setShowForm(false);
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      department: '',
      experience: '',
      schedule: ''
    });
    alert('Doctor added successfully!');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600">Manage doctor profiles and schedules</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Add New Doctor
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialization, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
              </select>

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
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Doctor</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
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
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="General">General Medicine</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
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
                        Phone
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Department name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
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
                      Schedule
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
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    Add Doctor
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doctors.slice(0, 3).map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSpecializationColor(doctor.specialization)}`}>
                    {doctor.specialization}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-bold">{doctor.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2" />
                  <span className="text-sm">{doctor.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2" />
                  <span className="text-sm">{doctor.phone}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doctor.status)}`}>
                  {doctor.status}
                </span>
                <span className="text-sm text-gray-500">{doctor.experience} experience</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </span>
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
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{doctor.appointments}</div>
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="flex items-center justify-center mt-1">
                          <FaStar className="text-yellow-500 w-3 h-3 mr-1" />
                          <span className="text-xs">{doctor.rating}/5</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`Viewing ${doctor.name}'s profile`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => alert(`Editing ${doctor.name}'s profile`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this doctor?')) {
                              setDoctors(doctors.filter(d => d.id !== doctor.id));
                              alert('Doctor removed successfully');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Remove"
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
                Showing <span className="font-medium">{filteredDoctors.length}</span> of <span className="font-medium">{doctors.length}</span> doctors
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Total Doctors</h3>
            <p className="text-3xl font-bold text-blue-700">{doctors.length}</p>
            <p className="text-sm text-blue-600 mt-2">
              {doctors.filter(d => d.status === 'active').length} active
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">Avg. Rating</h3>
            <p className="text-3xl font-bold text-green-700">
              {(doctors.reduce((acc, doc) => acc + doc.rating, 0) / doctors.length).toFixed(1)}
            </p>
            <p className="text-sm text-green-600 mt-2">Average doctor rating</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2">Total Appointments</h3>
            <p className="text-3xl font-bold text-purple-700">
              {doctors.reduce((acc, doc) => acc + doc.appointments, 0)}
            </p>
            <p className="text-sm text-purple-600 mt-2">This month</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">On Leave</h3>
            <p className="text-3xl font-bold text-yellow-700">
              {doctors.filter(d => d.status === 'on-leave').length}
            </p>
            <p className="text-sm text-yellow-600 mt-2">Currently unavailable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;