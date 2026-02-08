import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../services/api";

const DispenseMedicine = () => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  const handleRetrieve = async () => {
    try {
      const res = await api.get(`/prescriptions/${prescriptionId}`);
      setPrescription(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Prescription not found");
    }
  };


  const handleDispense = async () => {
    try {
      await api.post(`/prescriptions/dispense/${prescription.id}`);
      alert("Medicine dispensed successfully");
      setPrescription(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dispense medicine");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar role="pharmacist" />

      <div className="ml-64 p-6">
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <p><strong>Patient:</strong> {prescription.patientName}</p>
              <p><strong>Medicine:</strong> {prescription.medicine}</p>
              <p><strong>Strength:</strong> {prescription.strength}</p>
              <p><strong>Prescribed Qty:</strong> {prescription.quantity}</p>
              <p>
                <strong>Available Stock:</strong>{" "}
                {prescription.availableStock}
              </p>
            </div>

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
