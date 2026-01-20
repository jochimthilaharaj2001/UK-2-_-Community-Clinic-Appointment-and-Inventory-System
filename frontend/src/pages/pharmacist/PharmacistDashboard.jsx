import Sidebar from "../../components/Sidebar";
import StatsCard from "../../components/StatsCard";
import {
  FaPills,
  FaClipboardList,
  FaExclamationTriangle,
  FaFileAlt,
  FaTruck,
} from "react-icons/fa";

const PharmacistDashboard = () => {
  const dashboardStats = [
    {
      title: "Prescriptions Today",
      value: 18,
      icon: <FaClipboardList />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Medicines in Stock",
      value: 245,
      icon: <FaPills />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Low Stock Alerts",
      value: 6,
      icon: <FaExclamationTriangle />,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Reports Generated",
      value: 12,
      icon: <FaFileAlt />,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const lowStockMedicines = [
    { id: 1, name: "Paracetamol 500mg", quantity: 8 },
    { id: 2, name: "Amoxicillin 250mg", quantity: 5 },
    { id: 3, name: "Cetirizine", quantity: 4 },
  ];

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

            {lowStockMedicines.length === 0 ? (
              <p className="text-gray-500">No low-stock medicines.</p>
            ) : (
              <ul className="space-y-3">
                {lowStockMedicines.map((med) => (
                  <li
                    key={med.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-red-600">
                        Remaining: {med.quantity}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600">
                      <FaTruck /> Order
                    </button>
                  </li>
                ))}
              </ul>
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
