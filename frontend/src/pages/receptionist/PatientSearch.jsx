// pages/receptionist/PatientSearch.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaFileMedical,
  FaIdCard,
  FaArrowLeft
} from 'react-icons/fa';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (query = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/receptionist/patients${query ? `?search=${query}` : ''}`);
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Debounce search in a real app, but for now just call it
    if (e.target.value.length > 2 || e.target.value.length === 0) {
      fetchPatients(e.target.value);
    }
  };

  const filteredPatients = patients;

  const viewPatientDetails = async (patient) => {
    try {
      setLoading(true);
      const res = await api.get(`/receptionist/patients/${patient.id}`);
      setSelectedPatient(res.data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      alert('Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const [showFullRecord, setShowFullRecord] = useState(false);

  const closeDetails = () => {
    setSelectedPatient(null);
    setShowFullRecord(false);
  };

  const scheduleAppointment = (patient) => {
    navigate('/receptionist/book-appointment', { state: { patient } });
  };

  const quickActions = [
    { label: 'New Patient', path: '/receptionist/patient-registration' },
    { label: 'Schedule Appointment', path: '/receptionist/book-appointment' },
    { label: 'View Calendar', path: '/receptionist/appointments-calendar' },
    { label: 'Back to Dashboard', path: '/receptionist/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/receptionist/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-2">Search and manage patient records</p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/receptionist/patient-registration"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <FaUser />
            New Patient
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            {action.label}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Search & Results */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Search Patients</h2>
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name, phone, email, or patient ID..."
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Search
              </button>
              <button
                onClick={() => {
                  setSearchTerm('');
                  fetchPatients();
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">
                Results ({filteredPatients.length} patients found)
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{patient.name}</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <FaIdCard />
                              <span>#{patient.id}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <FaPhone />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <FaEnvelope />
                              <span>{patient.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">DOB: {patient.dob}</span>
                            <span className="text-gray-600">Last Visit: {patient.lastVisit}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                              {patient.insurance}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewPatientDetails(patient)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => scheduleAppointment(patient)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Appointments Today</span>
                <span className="font-bold text-gray-900">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Patients Waiting</span>
                <span className="font-bold text-yellow-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Patients</span>
                <span className="font-bold text-green-600">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Follow-ups</span>
                <span className="font-bold text-blue-600">8</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link
                to="/receptionist/book-appointment"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Book Appointment</p>
                  <p className="text-sm text-gray-600">Schedule new appointment</p>
                </div>
              </Link>
              <Link
                to="/receptionist/appointments-calendar"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">View Calendar</p>
                  <p className="text-sm text-gray-600">Daily/Weekly schedule</p>
                </div>
              </Link>
              <Link
                to="/receptionist/billing"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaFileMedical className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Billing</p>
                  <p className="text-sm text-gray-600">Invoices & payments</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                <p className="text-gray-600">Patient ID: {selectedPatient.patientId}</p>
              </div>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {!showFullRecord ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 underline">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedPatient.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedPatient.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{selectedPatient.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 underline">Additional Info</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{selectedPatient.dateOfBirth?.split('T')[0]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium capitalize">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-medium">{selectedPatient.bloodGroup || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Insurance Provider</p>
                        <p className="font-medium">{selectedPatient.insuranceProvider || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <FaFileMedical /> Allergies
                      </h3>
                      <p className="text-red-700">{selectedPatient.allergies || 'No known allergies'}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-bold text-blue-800 mb-2">Medical History</h3>
                      <p className="text-blue-700">{selectedPatient.medicalHistory || 'No history recorded'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h3 className="font-bold text-green-800 mb-2">Current Medications</h3>
                      <p className="text-green-700">{selectedPatient.currentMedications || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-2">Emergency Contact</h3>
                      <p className="font-medium text-gray-900">{selectedPatient.emergencyContact || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{selectedPatient.emergencyPhone}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-bold text-gray-900 mb-3">Insurance Details</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Provider</p>
                        <p className="text-sm font-medium">{selectedPatient.insuranceProvider}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Insurance ID</p>
                        <p className="text-sm font-medium">{selectedPatient.insuranceId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Policy Number</p>
                        <p className="text-sm font-medium">{selectedPatient.policyNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => scheduleAppointment(selectedPatient)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Schedule Appointment
                </button>
                <button
                  onClick={() => setShowFullRecord(!showFullRecord)}
                  className={`flex-1 py-3 ${showFullRecord ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} text-white font-medium rounded-lg transition-colors`}
                >
                  {showFullRecord ? 'View Contact Info' : 'View Full Record'}
                </button>
                <button
                  onClick={closeDetails}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
