import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaSearch, FaUserPlus, FaEye, FaFileMedical, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPatient, setViewingPatient] = useState(null);
  const [viewingRecords, setViewingRecords] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    address: '',
    medicalHistory: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctor/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (patientId) => {
    try {
      setRecordsLoading(true);
      const res = await api.get(`/doctor/patients/${patientId}/records`);
      setPatientRecords(res.data);
      setViewingRecords(patients.find(p => p.id === patientId));
    } catch (error) {
      console.error('Error fetching records:', error);
      alert('Failed to fetch medical records');
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/doctor/patients/register', formData);
      setShowAddModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        address: '',
        medicalHistory: ''
      });
      fetchPatients();
      alert('Patient registered successfully!');
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Failed to register patient. ' + (error.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredPatients = patients.filter(patient =>
    (patient.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (patient.condition?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (patient.phone || '').includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
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
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
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
                <button
                  onClick={() => fetchRecords(patient.id)}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  <FaFileMedical className="inline mr-1" /> Records
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Details Modal */}
        {viewingPatient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingPatient.name}</h2>
                  <p className="text-gray-600">{viewingPatient.age || 'N/A'} years • {viewingPatient.gender}</p>
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
                      <p className="font-medium">{viewingPatient.condition || 'No specific condition recorded'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-medium">{viewingPatient.bloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Visit</p>
                        <p className="font-medium">{viewingPatient.lastVisit || 'Today'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/doctor/schedule')}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Schedule Follow-up
                </button>
                <button
                  onClick={() => navigate('/doctor/prescriptions', { state: { openForm: true, patientId: viewingPatient.id } })}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                >
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

        {/* Add Patient Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Register New Patient</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+94 77 123 4567"
                    />
                    <p className="mt-1 text-[10px] text-gray-500">
                      Format: +94 77 123 4567 or 07X XXX XXXX
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical history (Optional)</label>
                  <textarea
                    name="medicalHistory"
                    rows="2"
                    value={formData.medicalHistory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Registering...' : 'Register Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Records Modal */}
        {viewingRecords && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Medical History: {viewingRecords.name}</h2>
                  <p className="text-gray-600">Patient ID: #{viewingRecords.id}</p>
                </div>
                <button onClick={() => setViewingRecords(null)} className="text-gray-500 hover:text-gray-700">
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {recordsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : patientRecords.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FaFileMedical className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No medical records found for this patient.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {patientRecords.map((record) => (
                    <div key={record.id} className="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold">
                            {new Date(record.record_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{record.record_type.toUpperCase()}</p>
                            <p className="text-sm text-gray-500">Recorded by: Dr. {record.doctor_name} ({record.doctor_specialization})</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                          <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-50">{record.diagnosis || 'No diagnosis recorded'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Treatment Plan</h4>
                          <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-50">{record.treatment || 'No treatment recorded'}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Notes</h4>
                        <p className="text-gray-800 bg-white p-3 rounded-lg border border-gray-50 whitespace-pre-wrap">{record.notes || 'No additional notes'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setViewingRecords(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Close History
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
