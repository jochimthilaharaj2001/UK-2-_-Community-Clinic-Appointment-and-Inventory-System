import Sidebar from '../../components/Sidebar';
import { FaFilePdf, FaPrint, FaBoxes, FaPills, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from "react";
import API_BASE_URL from "../../services/api";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const Report = () => {

const [reportData, setReportData] = useState({
  inventory: [],
  lowStock: [],
  dispensed: []   
});

const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setError("Not authenticated. Please log in.");
    setLoading(false);
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  };

  Promise.all([
    fetch(`${API_BASE_URL}/reports/inventory`, { headers }).then(res => {
      if (!res.ok) throw new Error(`Inventory error: ${res.status} ${res.statusText}`);
      return res.json();
    }),
    fetch(`${API_BASE_URL}/reports/low-stock`, { headers }).then(res => {
      if (!res.ok) throw new Error(`Low Stock error: ${res.status} ${res.statusText}`);
      return res.json();
    }),
    fetch(`${API_BASE_URL}/reports/dispensed`, { headers }).then(res => {
      if (!res.ok) throw new Error(`Dispensed error: ${res.status} ${res.statusText}`);
      return res.json();
    }),
  ])
    .then(([inventory, lowStock, dispensed]) => {
      setReportData({
        inventory: Array.isArray(inventory) ? inventory : [],
        lowStock: Array.isArray(lowStock) ? lowStock : [],
        dispensed: Array.isArray(dispensed) ? dispensed : []
      });
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to load report data:", err);
      setError("Failed to load report data: " + err.message);
      setLoading(false);
    });
}, []);

const generatePDF = (title, columns, rows) => {
  console.log("PDF rows:", rows);
  if (rows.length === 0) {
    alert("No data available to generate report");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Community Clinic Management System", 14, 15);

  doc.setFontSize(12);
  doc.text(title, 14, 25);

  autoTable(doc, {
  startY: 35,
  head: [columns],
  body: rows,
  styles: { fontSize: 9 },
  headStyles: { fillColor: [22, 160, 133] },
});


  doc.setFontSize(8);
  doc.text(
  `Generated on: ${new Date().toLocaleString()}`,
  14,
  doc.internal.pageSize.height - 10
);

  doc.save(`${title}.pdf`);
};


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 relative z-10">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Reports</h1>
          <p className="text-gray-500">
            View and generate inventory and prescription-related reports
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-sm text-red-700">
              ⚠ {error}
            </p>
          </div>
        )}

        {/* Debug Info */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-sm text-blue-700">
            📊 Inventory items: {reportData.inventory.length} | Low Stock: {reportData.lowStock.length} | Dispensed: {reportData.dispensed.length}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading report data...</p>
          </div>
        ) : (
          <>
            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <button 
                      onClick={() => {
                        const columns = [
                          "Generic Name",
                          "Brand",
                          "Strength",
                          "Batch",
                          "Quantity",
                          "Expiry Date",
                          "Manufacturer"
                        ];
                        const rows = reportData.inventory.map(item => [
                          item.generic_name || "",
                          item.brand_name || "",
                          item.strength || "",
                          item.batch_number || "",
                          item.quantity || 0,
                          item.expiry_date || "",
                          item.manufacturer || ""
                        ]);
                        generatePDF("Inventory Status Report", columns, rows);
                      }}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <FaFilePdf /> Export PDF
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
                  <button
                      onClick={() => {
                        const columns = [
                          "Prescription ID",
                          "Patient ID",
                          "Medicine",
                          "Quantity",
                          "Date"
                        ];

                        const rows = reportData.dispensed.map(item => [
                          item.id || "",
                          item.patient_id || "",
                          item.medicine_name || "",
                          item.quantity || 0,
                          item.dispensed_date || ""
                        ]);

                        generatePDF("Prescription Dispense Report", columns, rows);
                      }}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <FaFilePdf /> Export PDF
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
                  <button
                    onClick={() => {
                      const columns = [
                        "Medicine Generic Name",
                        "Medicine Brand Name",
                        "Batch",
                        "Quantity",
                        "Expiry Date",
                        "Manufacturer"
                      ];

                      const rows = reportData.lowStock.map(item => [
                        item.generic_name || "",
                        item.brand_name || "",
                        item.batch_number || "",
                        item.quantity || 0,
                        item.expiry_date || "",
                        item.manufacturer || ""
                      ]);

                      generatePDF("Low Stock & Expiry Alert Report", columns, rows);
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <FaFilePdf /> Export PDF
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
          </>
        )}

      </main>
    </div>
  );
};




export default Report;
