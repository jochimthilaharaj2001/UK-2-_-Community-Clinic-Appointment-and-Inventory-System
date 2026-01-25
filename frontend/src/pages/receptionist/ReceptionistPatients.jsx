import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaCalendarAlt, FaIdCard, FaUserPlus, FaDownload, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReceptionistPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingPatient, setViewingPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/receptionist/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const term = searchTerm.toLowerCase().trim();
    const formattedId = `PAT${String(patient.id).padStart(3, '0')}`;
    const matchesSearch = term === '' ||
      (patient.name || '').toLowerCase().includes(term) ||
      formattedId.toLowerCase().includes(term) ||
      (patient.id || '').toString().includes(term) ||
      (patient.phone || '').includes(term) ||
      (patient.email || '').toLowerCase().includes(term);

    const currentStatus = patient.status || 'Active';
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800'; // Default to active for new patients
    }
  };

  const getGenderColor = (gender) => {
    return gender?.toLowerCase() === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Gender', 'Phone', 'Email', 'Blood Group', 'Registered Date'];
    const csvContent = [
      headers.join(','),
      ...filteredPatients.map(p => [
        `PAT${String(p.id).padStart(3, '0')}`,
        `"${p.name}"`,
        p.gender || 'N/A',
        p.phone || 'N/A',
        p.email || 'N/A',
        p.blood_group || 'N/A',
        new Date(p.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Registry Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .footer { margin-top: 30px; text-align: right; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Patient Registry Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Total Patients: ${filteredPatients.length}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Blood Group</th>
                <th>Reg. Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPatients.map(p => `
                <tr>
                  <td>PAT${String(p.id).padStart(3, '0')}</td>
                  <td>${p.name}</td>
                  <td>${p.gender}</td>
                  <td>${p.phone}</td>
                  <td>${p.blood_group || 'N/A'}</td>
                  <td>${new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Rural Siddha Hospital - Patient Management System</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/receptionist/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Patient deleted successfully');
        fetchPatients(); // Refresh the list
      } else {
        alert('Failed to delete patient');
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert('Error deleting patient');
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
            <p className="text-gray-600">Register and manage patient records</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={handleExport}
              className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg flex items-center gap-2"
            >
              <FaDownload />
              Export Patients
            </button>
            <button
              onClick={() => navigate('/receptionist/register-patient')}
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
              <button
                onClick={handleGenerateReport}
                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <FaFileAlt />
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
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading patients...</td></tr>
                ) : filteredPatients.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-gray-500">No patients found.</td></tr>
                ) : filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FaIdCard className="text-amber-600 mr-2" />
                        <span className="font-mono font-bold text-gray-900">PAT{String(patient.id).padStart(3, '0')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Reg: {new Date(patient.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getGenderColor(patient.gender)}`}>
                            {patient.gender}
                          </span>
                          <span className="text-sm text-gray-600">{patient.age || 'N/A'} years</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate max-w-[200px]">{patient.address || 'No address'}</p>
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
                          <span className="truncate max-w-[150px]">{patient.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Blood Group</p>
                          <p className="font-medium text-red-600">{patient.blood_group || 'N/A'}</p>
                        </div>
                        <div className="flex gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Last Visit</p>
                            <p className="text-sm">{patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'Never'}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(patient.status || 'Active')}`}>
                        {patient.status || 'Active'}
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
                          <button
                            onClick={() => navigate(`/receptionist/register-patient?edit=${patient.id}`)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                            title="Edit Patient"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
                                handleDeletePatient(patient.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Patient"
                          >
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <FaIdCard className="text-amber-600 text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{viewingPatient.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">PAT{String(viewingPatient.id).padStart(3, '0')}</span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(viewingPatient.status || 'Active')}`}>
                          {viewingPatient.status || 'Active'}
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
                        <p className="font-medium">{viewingPatient.age || 'N/A'} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{viewingPatient.gender || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{viewingPatient.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered Date</p>
                      <p className="font-medium">{new Date(viewingPatient.created_at).toLocaleDateString()}</p>
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
                      <p className="font-medium">{viewingPatient.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="font-medium">{viewingPatient.emergency_contact || 'N/A'} ({viewingPatient.emergency_phone || 'N/A'})</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Medical Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium text-red-600">{viewingPatient.blood_group || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Allergies</p>
                      <p className="text-sm">{viewingPatient.allergies || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Medical History</p>
                      <p className="text-sm">{viewingPatient.medical_history || 'None'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setViewingPatient(null);
                        navigate('/receptionist/appointments', { state: { patientId: viewingPatient.id, patientName: viewingPatient.name } });
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Schedule Appointment
                    </button>
                    <button
                      onClick={() => {
                        setViewingPatient(null);
                        navigate(`/receptionist/register-patient?edit=${viewingPatient.id}`);
                      }}
                      className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                    >
                      Update Information
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
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
      </div>
    </div>
  );
};

export default ReceptionistPatients;