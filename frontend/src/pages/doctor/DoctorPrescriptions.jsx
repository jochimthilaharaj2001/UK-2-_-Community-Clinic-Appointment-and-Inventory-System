import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPrint, FaFileMedical, FaUser } from 'react-icons/fa';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    medication_name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const location = useLocation();

  useEffect(() => {
    fetchData();
    if (location.state?.openForm) {
      setShowForm(true);
      if (location.state.patientId) {
        setFormData(prev => ({ ...prev, patient_id: location.state.patientId }));
      }
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [presRes, patientsRes] = await Promise.all([
        api.get('/doctor/prescriptions'),
        api.get('/doctor/patients')
      ]);
      setPrescriptions(presRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/doctor/prescriptions/${editingId}`, formData);
        alert('Prescription updated successfully!');
      } else {
        await api.post('/doctor/prescriptions', formData);
        alert('Prescription created successfully!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        patient_id: '',
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prescription) => {
    setEditingId(prescription.id);
    setFormData({
      patient_id: prescription.patient_id,
      medication_name: prescription.medication_name,
      dosage: prescription.dosage || '',
      frequency: prescription.frequency || '',
      duration: prescription.duration || '',
      instructions: prescription.instructions || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        setLoading(true);
        await api.delete(`/doctor/prescriptions/${id}`);
        alert('Prescription deleted successfully!');
        fetchData();
      } catch (error) {
        console.error('Error deleting prescription:', error);
        alert('Failed to delete prescription.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredPrescriptions = prescriptions.filter(prescription =>
    (prescription.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (prescription.medication_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = (prescription) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Prescription ${prescription.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin-bottom: 5px;">COMMUNITY CLINIC</h1>
            <p style="margin: 0; color: #666;">Medical Prescription</p>
          </div>
          <hr style="border: 1px solid #eee;">
          <div style="margin: 20px 0;">
            <p><strong>Patient Name:</strong> ${prescription.patient_name}</p>
            <p><strong>Date:</strong> ${new Date(prescription.prescribed_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${prescription.status}</p>
          </div>
          <div style="margin: 30px 0;">
            <h3 style="border-bottom: 2px solid #2563eb; display: inline-block; padding-bottom: 5px;">Rx - Medication</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background: #f8fafc;">
                <th style="padding: 10px; text-align: left; border: 1px solid #e2e8f0;">Medicine</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #e2e8f0;">Dosage</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #e2e8f0;">Frequency</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #e2e8f0;">Duration</th>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${prescription.medication_name}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${prescription.dosage || 'N/A'}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${prescription.frequency || 'N/A'}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${prescription.duration || 'N/A'}</td>
              </tr>
            </table>
          </div>
          <div style="margin: 30px 0;">
            <h3 style="border-bottom: 2px solid #2563eb; display: inline-block; padding-bottom: 5px;">Instructions</h3>
            <p style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 10px;">
              ${prescription.instructions || 'No specific instructions provided.'}
            </p>
          </div>
          <div style="margin-top: 80px; display: flex; justify-content: space-between;">
            <div style="text-align: center;">
              <div style="width: 200px; border-bottom: 1px solid #333; margin-bottom: 10px;"></div>
              <p>Pharmacist Signature</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 200px; border-bottom: 1px solid #333; margin-bottom: 10px;"></div>
              <p>Doctor's Signature</p>
            </div>
          </div>
          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8;">
            <p>This is a computer-generated prescription. Community Clinic, Jaffna.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prescription Management</h1>
            <p className="text-gray-600">Create and manage patient prescriptions</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                patient_id: '',
                medication_name: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: ''
              });
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            New Prescription
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-6">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaUser className="text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-900">{prescription.patient_name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Date: {new Date(prescription.prescribed_date).toLocaleDateString()}</span>
                    <span className={`px-3 py-1 rounded-full ${getStatusColor(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint(prescription)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Print"
                  >
                    <FaPrint />
                  </button>
                  <button
                    onClick={() => handleEdit(prescription)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Medication:</h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="text-sm text-gray-500 mb-1">Medicine Name</div>
                      <div className="font-bold text-blue-900">{prescription.medication_name}</div>
                    </div>
                    <div className="w-32">
                      <div className="text-sm text-gray-500 mb-1">Dosage</div>
                      <div>{prescription.dosage || 'N/A'}</div>
                    </div>
                    <div className="w-40">
                      <div className="text-sm text-gray-500 mb-1">Frequency</div>
                      <div>{prescription.frequency || 'N/A'}</div>
                    </div>
                    <div className="w-32">
                      <div className="text-sm text-gray-500 mb-1">Duration</div>
                      <div>{prescription.duration || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                <p className="p-3 bg-blue-50 rounded-lg text-gray-700">
                  {prescription.instructions}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* New Prescription Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Prescription' : 'New Prescription'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <select
                    required
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="medication_name"
                      value={formData.medication_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Paracetamol"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 500mg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <input
                      type="text"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Three times a day"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 5 days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter instructions for the patient..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                    Save Prescription
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
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
