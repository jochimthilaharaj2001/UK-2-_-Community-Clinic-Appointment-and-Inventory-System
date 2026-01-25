// pages/doctor/DoctorPatients.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaUserPlus, FaEye, FaFileMedical, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPatient, setViewingPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState({ appointments: [], prescriptions: [] });
  const [showAddForm, setShowAddForm] = useState(false);

  const [newPatientData, setNewPatientData] = useState({
    name: '', email: '', phone: '', gender: '', dob: '', address: '', blood_type: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch patients');

      const data = await response.json();
      const enrichedData = data.map(p => ({
        ...p,
        status: 'Active',
        condition: 'General',
        lastVisit: '2024-01-01',
        nextAppointment: 'Pending'
      }));
      setPatients(enrichedData);
    } catch (err) {
      console.error(err);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/doctor/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPatientData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add patient');

      alert('Patient added successfully!');
      setShowAddForm(false);
      setNewPatientData({ name: '', email: '', phone: '', gender: '', dob: '', address: '', blood_type: '' });
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const fetchPatientHistory = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/doctor/patients/${patientId}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setPatientHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [modalTab, setModalTab] = useState('info'); // 'info' or 'records'

  const openViewDetails = (patient, tab = 'info') => {
    setViewingPatient(patient);
    setModalTab(tab);
    setPatientHistory({ appointments: [], prescriptions: [] });
    fetchPatientHistory(patient.id);
  };

  const filteredPatients = patients.filter(patient =>
    (patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.phone && patient.phone.includes(searchTerm)) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Follow-up Required': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 flex justify-center items-center">
        Loading patients...
      </div>
    </div>
  );

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
            onClick={() => setShowAddForm(true)}
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
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPatients.length === 0 ? (
            <div className="col-span-3 text-center py-10 text-gray-500">No patients found.</div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                    <p className="text-gray-600">{patient.age ? `${patient.age} years` : 'Age N/A'} • {patient.gender || 'N/A'}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2 text-sm" />
                    <span className="text-sm">{patient.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2 text-sm" />
                    <span className="text-sm truncate">{patient.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-sm" />
                    <span className="text-sm">Last Visit: {patient.lastVisit}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openViewDetails(patient, 'info')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                  >
                    <FaEye className="inline mr-1" /> View Details
                  </button>
                  <button
                    onClick={() => openViewDetails(patient, 'records')}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                  >
                    <FaFileMedical className="inline mr-1" /> Records
                  </button>
                </div>
              </div>
            )))}
        </div>

        {/* Patient Details Modal */}
        {viewingPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingPatient.name}</h2>
                  <p className="text-gray-600">{viewingPatient.age ? `${viewingPatient.age} years` : ''} • {viewingPatient.gender}</p>
                </div>
                <button
                  onClick={() => setViewingPatient(null)}
                  className="text-gray-400 hover:text-gray-600 text-3xl"
                >
                  &times;
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setModalTab('info')}
                  className={`px-6 py-2 font-medium text-sm transition-colors ${modalTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  General Info
                </button>
                <button
                  onClick={() => setModalTab('records')}
                  className={`px-6 py-2 font-medium text-sm transition-colors ${modalTab === 'records' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Medical Records
                </button>
              </div>

              {modalTab === 'info' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 border-b pb-1">Contact Details</h3>
                    <p><span className="text-gray-500 text-sm font-medium">Email:</span> {viewingPatient.email || 'N/A'}</p>
                    <p><span className="text-gray-500 text-sm font-medium">Phone:</span> {viewingPatient.phone || 'N/A'}</p>
                    <p><span className="text-gray-500 text-sm font-medium">Address:</span> {viewingPatient.address || 'N/A'}</p>
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 border-b pb-1">Medical Info</h3>
                    <p><span className="text-gray-500 text-sm font-medium">Blood Group:</span> {viewingPatient.blood_type || 'N/A'}</p>
                    <p><span className="text-gray-500 text-sm font-medium">DOB:</span> {viewingPatient.dob || 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-600" />
                      Appointment History
                    </h3>
                    {patientHistory.appointments.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No appointment history found.</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {patientHistory.appointments.map(app => (
                          <div key={app.id} className="bg-white p-3 rounded-lg border shadow-sm text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-800">{app.date}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${app.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-gray-600">{app.reason || 'Regular Visit'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <FaFileMedical className="mr-2 text-green-600" />
                      Prescription History
                    </h3>
                    {patientHistory.prescriptions.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No prescription history found.</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {patientHistory.prescriptions.map(pres => (
                          <div key={pres.id} className="bg-white p-3 rounded-lg border shadow-sm text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-800">{new Date(pres.created_at).toLocaleDateString()}</span>
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                {pres.status}
                              </span>
                            </div>
                            <div className="text-gray-600 text-xs">
                              {pres.medicines?.map(m => m.medicine_name).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setViewingPatient(null)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Add Patient Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Patient</h2>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newPatientData.name}
                      onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newPatientData.email}
                      onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newPatientData.phone}
                      onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={newPatientData.gender}
                      onChange={(e) => setNewPatientData({ ...newPatientData, gender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newPatientData.dob}
                      onChange={(e) => setNewPatientData({ ...newPatientData, dob: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                    <input
                      type="text"
                      value={newPatientData.blood_type}
                      onChange={(e) => setNewPatientData({ ...newPatientData, blood_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. O+"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={newPatientData.address}
                    onChange={(e) => setNewPatientData({ ...newPatientData, address: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    Add Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
