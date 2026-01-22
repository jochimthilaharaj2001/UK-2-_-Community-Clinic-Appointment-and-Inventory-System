import Sidebar from "../../components/Sidebar";
import StatsCard from "../../components/StatsCard";
import { useState, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";
import {
  FaPills,
  FaClipboardList,
  FaExclamationTriangle,
  FaFileAlt,
  FaTruck,
} from "react-icons/fa";

const PharmacistDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: "Prescriptions Today",
      value: 0,
      icon: <FaClipboardList />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Medicines in Stock",
      value: 0,
      icon: <FaPills />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Low Stock Alerts",
      value: 0,
      icon: <FaExclamationTriangle />,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Expired Medicines",
      value: 0,
      icon: <FaFileAlt />,
      color: "bg-orange-100 text-orange-700",
    },
  ]);

  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [inventoryTotal, setInventoryTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch inventory data
      const inventoryRes = await fetch(`${API_BASE_URL}/pharmacist/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const inventoryData = await inventoryRes.json();

      // Fetch low stock report
      const lowStockRes = await fetch(`${API_BASE_URL}/reports/low-stock`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lowStockData = await lowStockRes.json();

      // Fetch dispensed prescriptions
      const dispensedRes = await fetch(`${API_BASE_URL}/reports/dispensed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dispensedData = await dispensedRes.json();

      // Calculate statistics
      const totalMedicines = Array.isArray(inventoryData) ? inventoryData.length : 0;
      const lowStockCount = Array.isArray(lowStockData) ? lowStockData.length : 0;
      const expiredCount = Array.isArray(inventoryData) 
        ? inventoryData.filter(item => {
            const expiry = new Date(item.expiry_date);
            return expiry < new Date();
          }).length 
        : 0;
      const dispensedCount = Array.isArray(dispensedData) ? dispensedData.length : 0;

      // Update stats
      setDashboardStats([
        {
          title: "Dispensed Today",
          value: dispensedCount,
          icon: <FaClipboardList />,
          color: "bg-blue-100 text-blue-700",
        },
        {
          title: "Total Medicines",
          value: totalMedicines,
          icon: <FaPills />,
          color: "bg-green-100 text-green-700",
        },
        {
          title: "Low Stock Alerts",
          value: lowStockCount,
          icon: <FaExclamationTriangle />,
          color: "bg-red-100 text-red-700",
        },
        {
          title: "Expired Medicines",
          value: expiredCount,
          icon: <FaFileAlt />,
          color: "bg-orange-100 text-orange-700",
        },
      ]);

      // Set low stock medicines
      if (Array.isArray(lowStockData)) {
        setLowStockMedicines(lowStockData);
      }

      setInventoryTotal(totalMedicines);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar (Fixed) */}
      <Sidebar role="pharmacist" />

      {/* Main Content */}
      <div className="ml-64 p-6 relative z-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pharmacist Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dispense Medicine */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaClipboardList /> Dispense Medicine
            </h2>
            <p className="text-gray-600 mb-4">
              Retrieve prescriptions, validate availability, dispense medicine,
              and update stock.
            </p>
            <button
              onClick={() => (window.location.href = "/pharmacist/dispense")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Dispense Medicine
            </button>
          </div>

          {/* Inventory Management */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPills /> Inventory Management
            </h2>
            <p className="text-gray-600 mb-4">
              Add, update, delete medicines and monitor stock levels.
            </p>
            <button
              onClick={() => (window.location.href = "/pharmacist/inventory")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Manage Inventory
            </button>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaExclamationTriangle /> Low Stock Alerts
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : lowStockMedicines.length === 0 ? (
              <p className="text-green-600 font-medium">✓ All medicines have sufficient stock!</p>
            ) : (
              <ul className="space-y-3">
                {lowStockMedicines.slice(0, 5).map((med, idx) => (
                  <li
                    key={med.id || idx}
                    className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{med.generic_name || med.name}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Brand: {med.brand_name || 'N/A'}</span>
                        <span>Batch: {med.batch_number || 'N/A'}</span>
                      </div>
                      <p className="text-sm text-red-600 font-semibold">
                        Qty: {med.quantity} | Status: {med.status || 'Low Stock'}
                      </p>
                    </div>
                    <button 
                      onClick={() => alert(`Order request for ${med.generic_name || med.name} sent to admin`)}
                      className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 whitespace-nowrap"
                    >
                      <FaTruck /> Order
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {lowStockMedicines.length > 5 && (
              <p className="text-sm text-gray-500 mt-3">
                And {lowStockMedicines.length - 5} more low stock items...
              </p>
            )}
          </div>

          {/* Reports */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaFileAlt /> Reports
            </h2>
            <p className="text-gray-600 mb-4">
              Generate inventory and prescription reports in printable format.
            </p>
            <button
              onClick={() => (window.location.href = "/pharmacist/reports")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
