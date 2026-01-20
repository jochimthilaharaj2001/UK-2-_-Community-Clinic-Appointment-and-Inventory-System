// pages/doctor/DoctorPrescriptions.jsx
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPrint, FaFileMedical, FaUser } from 'react-icons/fa';

const DoctorPrescriptions = () => {
  const [prescriptions] = useState([
    { 
      id: 1, 
      patientName: 'John Smith', 
      date: '2024-01-15',
      medicines: [
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
      ],
      instructions: 'Take after breakfast. Monitor blood pressure weekly.',
      status: 'Active'
    },
    { 
      id: 2, 
      patientName: 'Emily Johnson', 
      date: '2024-01-14',
      medicines: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
      ],
      instructions: 'Take with meals. Check blood sugar levels regularly.',
      status: 'Active'
    },
    { 
      id: 3, 
      patientName: 'Michael Brown', 
      date: '2024-01-12',
      medicines: [
        { name: 'Albuterol', dosage: '100mcg', frequency: 'As needed', duration: '90 days' },
        { name: 'Fluticasone', dosage: '250mcg', frequency: 'Twice daily', duration: '30 days' }
      ],
      instructions: 'Use inhaler before exercise. Rinse mouth after use.',
      status: 'Completed'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: ''
  });

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
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
          {filteredPrescriptions.map((prescription) => (
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
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Medicines */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Medicines:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {prescription.medicines.map((medicine, index) => (
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
          ))}
        </div>

        {/* New Prescription Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">New Prescription</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter patient name"
                  />
                </div>

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
                          setFormData({...formData, medicines: newMedicines});
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
                          setFormData({...formData, medicines: newMedicines});
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
                          setFormData({...formData, medicines: newMedicines});
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
                          setFormData({...formData, medicines: newMedicines});
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
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter instructions for the patient..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                  Save Prescription
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

export default DoctorPrescriptions;