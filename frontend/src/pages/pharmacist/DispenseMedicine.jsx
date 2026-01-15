import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const DispenseMedicine = () => {
  const [search, setSearch] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX001',
      patient: 'John Smith',
      patientId: 'P12345',
      doctor: 'Dr. Emily Johnson',
      date: '2024-01-08',
      medicines: [
        { name: 'Paracetamol 500mg', qty: 30, inStock: true },
        { name: 'Ibuprofen 400mg', qty: 20, inStock: true }
      ],
      status: 'Pending'
    },
    {
      id: 'RX002',
      patient: 'Sarah Wilson',
      patientId: 'P67890',
      doctor: 'Dr. Michael Brown',
      date: '2024-01-08',
      medicines: [
        { name: 'Amoxicillin 250mg', qty: 21, inStock: false }
      ],
      status: 'Pending'
    },
    {
      id: 'RX003',
      patient: 'Robert Davis',
      patientId: 'P11223',
      doctor: 'Dr. Lisa Anderson',
      date: '2024-01-07',
      medicines: [
        { name: 'Aspirin 75mg', qty: 90, inStock: true }
      ],
      status: 'Dispensed'
    }
  ]);

  const handleDispense = (id) => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === id ? { ...rx, status: 'Dispensed' } : rx
      )
    );
    alert('Medicine dispensed and inventory updated successfully');
  };

  const filteredPrescriptions = prescriptions.filter(
    (rx) =>
      rx.patient.toLowerCase().includes(search.toLowerCase()) ||
      rx.id.toLowerCase().includes(search.toLowerCase()) ||
      rx.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dispense Medicine</h1>
          <p className="text-gray-500">
            View doctor prescriptions and dispense medicines to patients
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by patient, prescription ID, or doctor"
              className="bg-transparent outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Prescription Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4">Prescription ID</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Date</th>
                <th className="p-4">Medicines</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((rx) => {
                const outOfStock = rx.medicines.some(m => !m.inStock);

                return (
                  <tr key={rx.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{rx.id}</td>
                    <td className="p-4">
                      {rx.patient}
                      <div className="text-sm text-gray-400">
                        ID: {rx.patientId}
                      </div>
                    </td>
                    <td className="p-4">{rx.doctor}</td>
                    <td className="p-4">{rx.date}</td>
                    <td className="p-4">
                      {rx.medicines.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {med.inStock ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaExclamationTriangle className="text-red-500" />
                          )}
                          <span>
                            {med.name} ({med.qty})
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rx.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {rx.status === 'Pending' && !outOfStock ? (
                        <button
                          onClick={() => handleDispense(rx.id)}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                          Dispense
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                        >
                          Completed
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Error Handling Note */}
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">
            ⚠ Dispensing is blocked if any prescribed medicine is out of stock or mismatched.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DispenseMedicine;
