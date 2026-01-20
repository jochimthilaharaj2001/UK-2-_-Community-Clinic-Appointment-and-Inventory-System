import Sidebar from '../../components/Sidebar';
import { FaFilePdf, FaPrint, FaBoxes, FaPills, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from "react";
import API_BASE_URL from "../../services/api";


const Report = () => {

const [reportData, setReportData] = useState([]);

useEffect(() => {
  fetch(`${API_BASE_URL}/reports/inventory`)
    .then((res) => res.json())
    .then((data) => setReportData(data))
    .catch(() => alert("Failed to load report"));
}, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Reports</h1>
          <p className="text-gray-500">
            View and generate inventory and prescription-related reports
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Inventory Status Report */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaBoxes className="text-blue-600 text-2xl" />
              <h2 className="text-lg font-semibold">Inventory Status Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Displays current stock levels, available medicines, and shortages.
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Total medicines in stock</li>
              <li>Low stock alerts</li>
              <li>Out-of-stock items</li>
            </ul>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <FaFilePdf /> Export PDF
              </button>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
                <FaPrint /> Print
              </button>
            </div>
          </div>

          {/* Prescription / Dispense Report */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaPills className="text-green-600 text-2xl" />
              <h2 className="text-lg font-semibold">Prescription Dispense Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Summary of medicines dispensed based on prescriptions.
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Daily / Monthly dispensing trends</li>
              <li>Most dispensed medicines</li>
              <li>Prescription reference numbers</li>
            </ul>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <FaFilePdf /> Export PDF
              </button>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
                <FaPrint /> Print
              </button>
            </div>
          </div>

          {/* Expiry & Alerts Report */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
              <h2 className="text-lg font-semibold">Expiry & Alert Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Highlights expired medicines and upcoming expiry alerts.
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Expired medicine list</li>
              <li>Medicines expiring within 30 days</li>
              <li>Batch-wise expiry details</li>
            </ul>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                <FaFilePdf /> Export PDF
              </button>
              <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
                <FaPrint /> Print
              </button>
            </div>
          </div>

        </div>

        {/* Error Handling Note */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700">
            ⚠ If report data is unavailable or incomplete, the system will notify the user and prevent report generation.
          </p>
        </div>

      </main>
    </div>
  );
};




export default Report;
