// pages/doctor/DoctorPrescriptions.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPrint, FaFileMedical, FaUser } from 'react-icons/fa';

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);


  const [formData, setFormData] = useState({
    patientName: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/doctor/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch prescriptions');

      const data = await response.json();

      // Map backend data to frontend format
      const formatted = data.map(p => ({
        id: p.id,
        patientName: p.patient_name || 'Unknown',
        date: new Date(p.created_at).toLocaleDateString(),
        status: p.status,
        instructions: p.diagnostic,
        medicines: p.medicines ? p.medicines.map(m => ({
          name: m.medicine_name,
          dosage: m.strength,
          frequency: m.frequency,
          duration: m.duration
        })) : []
      }));

      setPrescriptions(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingId
        ? `http://localhost:5000/api/doctor/prescriptions/${editingId}`
        : 'http://localhost:5000/api/doctor/prescriptions';

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save prescription');
      }

      alert(editingId ? 'Prescription updated successfully!' : 'Prescription created successfully!');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        patientName: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
        instructions: ''
      });
      fetchPrescriptions(); // Refresh list

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/doctor/prescriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete prescription');

      setPrescriptions(prev => prev.filter(p => p.id !== id));
      alert('Prescription deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting prescription');
    }
  };

  const startEdit = (prescription) => {
    setEditingId(prescription.id);
    setFormData({
      patientName: prescription.patientName,
      medicines: prescription.medicines.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration
      })),
      instructions: prescription.instructions,
      status: prescription.status
    });
    setShowForm(true);
  };


  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = (prescription) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Prescription ${prescription.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Medical Prescription</h2>
          <hr>
          <p><strong>Patient:</strong> ${prescription.patientName}</p>
          <p><strong>Date:</strong> ${prescription.date}</p>
          <p><strong>Status:</strong> ${prescription.status}</p>
          <br>
          <h3>Medicines:</h3>
          ${prescription.medicines.map(med => `
            <p>• ${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}</p>
          `).join('')}
          <br>
          <h3>Instructions:</h3>
          <p>${prescription.instructions}</p>
          <hr>
          <p style="margin-top: 30px;"><strong>Doctor's Signature:</strong> ___________________</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 flex justify-center items-center">Loading...</div>
    </div>
  );

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
            onClick={() => setShowForm(true)}
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
          {filteredPrescriptions.length === 0 ? (
            <p className="text-center text-gray-500">No prescriptions found.</p>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaUser className="text-gray-400" />
                      <h3 className="text-xl font-bold text-gray-900">{prescription.patientName}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Date: {prescription.date}</span>
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
                      onClick={() => startEdit(prescription)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeletePrescription(prescription.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Medicines */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Medicines:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prescription.medicines && prescription.medicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{medicine.name} {medicine.dosage}</div>
                        <div className="text-sm text-gray-600">
                          {medicine.frequency} • {medicine.duration}
                        </div>
                      </div>
                    ))}
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
            ))
          )}
        </div>

        {/* New Prescription Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Prescription' : 'New Prescription'}
              </h2>


              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name * {editingId ? '(Read-only)' : '(Must be registered)'}
                  </label>
                  <input
                    type="text"
                    list="patient-list"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    disabled={!!editingId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Search or enter patient name..."
                  />
                  <datalist id="patient-list">
                    {patients.map(p => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>

                {editingId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}


                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Medicines *
                    </label>
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
                      })}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Medicine
                    </button>
                  </div>
                  {formData.medicines.map((medicine, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        className="px-3 py-2 border rounded-lg"
                        value={medicine.name}
                        onChange={(e) => {
                          const newMedicines = [...formData.medicines];
                          newMedicines[index].name = e.target.value;
                          setFormData({ ...formData, medicines: newMedicines });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        className="px-3 py-2 border rounded-lg"
                        value={medicine.dosage}
                        onChange={(e) => {
                          const newMedicines = [...formData.medicines];
                          newMedicines[index].dosage = e.target.value;
                          setFormData({ ...formData, medicines: newMedicines });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        className="px-3 py-2 border rounded-lg"
                        value={medicine.frequency}
                        onChange={(e) => {
                          const newMedicines = [...formData.medicines];
                          newMedicines[index].frequency = e.target.value;
                          setFormData({ ...formData, medicines: newMedicines });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        className="px-3 py-2 border rounded-lg"
                        value={medicine.duration}
                        onChange={(e) => {
                          const newMedicines = [...formData.medicines];
                          newMedicines[index].duration = e.target.value;
                          setFormData({ ...formData, medicines: newMedicines });
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter instructions for the patient..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCreatePrescription}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                  Save Prescription
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      patientName: '',
                      medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
                      instructions: ''
                    });
                  }}
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

export default DoctorPrescriptions;
