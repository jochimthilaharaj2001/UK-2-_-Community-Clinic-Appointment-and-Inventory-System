// pages/doctor/DoctorPatients.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaUserPlus, FaEye, FaFileMedical, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const DoctorPatients = () => {
  const [patients] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      age: 45, 
      gender: 'Male',
      phone: '+1 (234) 567-8901',
      email: 'john.smith@email.com',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      condition: 'Hypertension',
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'Emily Johnson', 
      age: 32, 
      gender: 'Female',
      phone: '+1 (234) 567-8902',
      email: 'emily.j@email.com',
      lastVisit: '2024-01-14',
      nextAppointment: '2024-02-14',
      condition: 'Diabetes Type 2',
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      age: 58, 
      gender: 'Male',
      phone: '+1 (234) 567-8903',
      email: 'm.brown@email.com',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-02-12',
      condition: 'Asthma',
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'Sarah Miller', 
      age: 29, 
      gender: 'Female',
      phone: '+1 (234) 567-8904',
      email: 'sarah.m@email.com',
      lastVisit: '2023-12-20',
      nextAppointment: '2024-02-10',
      condition: 'Migraine',
      status: 'Follow-up Required'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPatient, setViewingPatient] = useState(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Follow-up Required': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600">Manage your patients and their medical records</p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center">
            <FaUserPlus className="mr-2" />
            Add New Patient
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, condition, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-sm" />
                  <span className="text-sm">{patient.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-sm" />
                  <span className="text-sm truncate">{patient.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2 text-sm" />
                  <span className="text-sm">Last: {patient.lastVisit}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Medical Condition</p>
                <p className="font-medium text-gray-900">{patient.condition}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewingPatient(patient)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                >
                  <FaEye className="inline mr-1" /> View Details
                </button>
                <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                  <FaFileMedical className="inline mr-1" /> Records
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Details Modal */}
        {viewingPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingPatient.name}</h2>
                  <p className="text-gray-600">{viewingPatient.age} years • {viewingPatient.gender}</p>
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
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{viewingPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{viewingPatient.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Medical Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">{viewingPatient.condition}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Last Visit</p>
                        <p className="font-medium">{viewingPatient.lastVisit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Appointment</p>
                        <p className="font-medium text-blue-600">{viewingPatient.nextAppointment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                  Schedule Follow-up
                </button>
                <button className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg">
                  Write Prescription
                </button>
                <button
                  onClick={() => setViewingPatient(null)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;