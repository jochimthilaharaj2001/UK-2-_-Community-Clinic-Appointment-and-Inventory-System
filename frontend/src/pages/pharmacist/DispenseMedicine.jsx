import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import API_BASE_URL from "../../services/api";

const DispenseMedicine = () => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  // 🔍 Retrieve Prescription
  const handleRetrieve = async () => {
    setError("");
    setPrescription(null);
    setItems([]);

    if (!prescriptionId) {
      setError("Please enter prescription ID");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/prescriptions/${prescriptionId}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Prescription not found");
        return;
      }

      setPrescription(data.prescription);
      setItems(data.items);

    } catch (err) {
      setError("Server error while retrieving prescription");
    }
  };

  // 💊 Dispense Medicine
  const handleDispense = async () => {
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/prescriptions/dispense`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prescription_id: prescription.id })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to dispense medicine");
        return;
      }

      alert("✅ Medicine dispensed successfully");
      setPrescription(null);
      setItems([]);
      setPrescriptionId("");

    } catch {
      setError("Server error while dispensing medicine");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar role="pharmacist" />

      <div className="ml-64 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dispense Medicine
        </h1>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Prescription ID"
              className="border rounded px-4 py-2 w-full"
              value={prescriptionId}
              onChange={(e) => setPrescriptionId(e.target.value)}
            />
            <button
              onClick={handleRetrieve}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
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
              Prescription #{prescription.id}
            </h2>

            <p className="mb-2">
              <strong>Doctor:</strong> {prescription.doctor_name}
            </p>

            <p className="mb-4">
              <strong>Notes:</strong> {prescription.notes || "—"}
            </p>

            {/* Medicine Table */}
            <table className="w-full border mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Medicine</th>
                  <th className="p-2 border">Strength</th>
                  <th className="p-2 border">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{item.medicine_name}</td>
                    <td className="p-2 border">{item.strength}</td>
                    <td className="p-2 border">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
