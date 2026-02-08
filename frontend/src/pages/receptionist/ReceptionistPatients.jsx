import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaCalendarAlt, FaIdCard, FaUserPlus } from 'react-icons/fa';

const ReceptionistPatients = () => {
  const [patients] = useState([
    {
      id: 1,
      patientId: 'PAT001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+94 77 123 4567',
      email: 'john.smith@email.com',
      address: '123 Main St, City',
      bloodGroup: 'O+',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      registeredDate: '2023-05-10',
      status: 'Active'
    },
    {
      id: 2,
      patientId: 'PAT002',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      phone: '+94 77 123 4567',
      email: 'emily.j@email.com',
      address: '456 Oak Ave, Town',
      bloodGroup: 'A+',
      lastVisit: '2024-01-14',
      nextAppointment: '2024-02-14',
      registeredDate: '2023-06-15',
      status: 'Active'
    },
    {
      id: 3,
      patientId: 'PAT003',
      name: 'Michael Brown',
      age: 58,
      gender: 'Male',
      phone: '+94 77 123 4567',
      email: 'm.brown@email.com',
      address: '789 Pine Rd, Village',
      bloodGroup: 'B+',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-02-12',
      registeredDate: '2023-07-20',
      status: 'Active'
    },
    {
      id: 4,
      patientId: 'PAT004',
      name: 'Sarah Miller',
      age: 29,
      gender: 'Female',
      phone: '+94 77 123 4567',
      email: 'sarah.m@email.com',
      address: '101 Maple Dr, Suburb',
      bloodGroup: 'AB+',
      lastVisit: '2023-12-20',
      nextAppointment: '2024-02-10',
      registeredDate: '2023-08-05',
      status: 'Inactive'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    bloodGroup: '',
    emergencyContact: ''
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderColor = (gender) => {
    return gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  const generatePatientId = () => {
    return `PAT${String(patients.length + 1).padStart(3, '0')}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600">Register and manage patient records</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg">
              Export Patients
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center"
            >
              <FaUserPlus className="mr-2" />
              Register Patient
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, ID, or contact..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>

            <div>
              <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
                Generate Reports
              </button>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Patient ID</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Patient Details</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Contact</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Medical Info</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FaIdCard className="text-amber-600 mr-2" />
                        <span className="font-mono font-bold text-gray-900">{patient.patientId}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Reg: {patient.registeredDate}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getGenderColor(patient.gender)}`}>
                            {patient.gender}
                          </span>
                          <span className="text-sm text-gray-600">{patient.age} years</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{patient.address}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaPhone className="mr-2 text-xs" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaEnvelope className="mr-2 text-xs" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Blood Group</p>
                          <p className="font-medium text-red-600">{patient.bloodGroup}</p>
                        </div>
                        <div className="flex gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Last Visit</p>
                            <p className="text-sm">{patient.lastVisit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Next Visit</p>
                            <p className="text-sm text-amber-600">{patient.nextAppointment}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setViewingPatient(patient)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                        >
                          View Details
                        </button>
                        <div className="flex gap-2">
                          <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                            <FaEdit />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Details Modal */}
        {viewingPatient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <FaIdCard className="text-amber-600 text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{viewingPatient.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{viewingPatient.patientId}</span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(viewingPatient.status)}`}>
                          {viewingPatient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingPatient(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{viewingPatient.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{viewingPatient.gender}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{viewingPatient.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered Date</p>
                      <p className="font-medium">{viewingPatient.registeredDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{viewingPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{viewingPatient.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Medical Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium text-red-600">{viewingPatient.bloodGroup}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Last Visit</p>
                        <p className="font-medium">{viewingPatient.lastVisit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Appointment</p>
                        <p className="font-medium text-amber-600">{viewingPatient.nextAppointment}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Schedule Appointment
                    </button>
                    <button className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
                      Update Information
                    </button>
                    <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                      View Medical History
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg">
                  Print Details
                </button>
                <button
                  onClick={() => setViewingPatient(null)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Patient Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Patient</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      value={newPatient.bloodGroup}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="+94 77 123 4567"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Format: +94 77 123 4567 or 07X XXX XXXX
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="john@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="123 Main St, City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={newPatient.emergencyContact}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="+94 77 123 4568"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: +94 77 123 4567 or 07X XXX XXXX
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg">
                  Register Patient
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

export default ReceptionistPatients;
