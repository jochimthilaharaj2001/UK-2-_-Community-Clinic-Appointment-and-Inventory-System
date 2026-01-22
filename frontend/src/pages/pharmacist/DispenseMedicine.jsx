import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import API_BASE_URL from "../../config/apiConfig";

const DispenseMedicine = () => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

 const handleRetrieve = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/prescriptions/${prescriptionId}`
    );
    const data = await res.json();

    if (!res.ok || !data) {
      setError("Prescription not found");
      return;
    }

    setPrescription(data);
  } catch {
    setError("Server error");
  }
};


  const handleDispense = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/prescriptions/${prescription.id}/dispense`,
      { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescription_id: prescription.id })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    alert("Medicine dispensed successfully");
    setPrescription(null);
    setPrescriptionId("");
  } catch (error) {
    console.error(error);
    setError("Failed to dispense medicine");
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar role="pharmacist" />

      <div className="ml-64 p-6 relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dispense Medicine
        </h1>

        {/* Prescription Search */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter Prescription ID"
              className="border rounded px-4 py-2 w-full"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
            />
            <button
              onClick={handleRetrieve}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSearch /> Retrieve
            </button>
          </div>

          {error && (
            <p className="text-red-600 mt-3 flex items-center gap-2">
              <FaTimesCircle /> {error}
            </p>
          )}
        </div>

        {/* Prescription Details */}
        {prescription && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Prescription Details
            </h2>

            {/* Prescription Header */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
              <p><strong>Prescription ID:</strong> {prescription.id}</p>
              <p><strong>Patient:</strong> {prescription.patientName || 'N/A'}</p>
              <p><strong>Doctor:</strong> {prescription.doctor_name || 'N/A'}</p>
              <p><strong>Status:</strong> <span className={prescription.status === 'DISPENSED' ? 'text-green-600' : 'text-orange-600'}>{prescription.status}</span></p>
              <p><strong>Notes:</strong> {prescription.notes || 'None'}</p>
              <p><strong>Date:</strong> {new Date(prescription.created_at).toLocaleDateString()}</p>
            </div>

            {/* Prescription Items Table */}
            <h3 className="text-lg font-semibold mb-3">Medicines in Prescription</h3>
            {prescription.items && prescription.items.length > 0 ? (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Generic Name</th>
                      <th className="px-4 py-2 text-left">Brand Name</th>
                      <th className="px-4 py-2 text-left">Strength</th>
                      <th className="px-4 py-2 text-center">Qty Required</th>
                      <th className="px-4 py-2 text-center">Available Stock</th>
                      <th className="px-4 py-2 text-center">Price (LKR)</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.items.map((item, idx) => {
                      const isAvailable = item.availableStock >= item.quantity;
                      return (
                        <tr key={item.id || idx} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{item.generic_name || 'N/A'}</td>
                          <td className="px-4 py-2">{item.brand_name || 'N/A'}</td>
                          <td className="px-4 py-2">{item.strength || 'N/A'}</td>
                          <td className="px-4 py-2 text-center font-semibold">{item.quantity || 0}</td>
                          <td className="px-4 py-2 text-center">{item.availableStock || 0}</td>
                          <td className="px-4 py-2 text-center">{item.selling_price || 'N/A'}</td>
                          <td className="px-4 py-2 text-center">
                            {isAvailable ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Available</span>
                            ) : (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Out of Stock</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No medicines in this prescription.</p>
            )}

            <button
              onClick={handleDispense}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <FaCheckCircle /> Dispense Medicine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispenseMedicine;
