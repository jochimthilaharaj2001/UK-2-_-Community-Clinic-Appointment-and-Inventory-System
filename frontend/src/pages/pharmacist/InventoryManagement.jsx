import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const inventoryData = [
    {
      id: 1,
      genericName: "Paracetamol",
      brandName: "Panadol",
      strength: "500 mg",
      batchNo: "BCH-1023",
      manufacturer: "GSK",
      expiryDate: "2026-05-20",
      quantity: 120,
      price: 15.0,
    },
    {
      id: 2,
      genericName: "Amoxicillin",
      brandName: "Amoxil",
      strength: "250 mg",
      batchNo: "BCH-2045",
      manufacturer: "Pfizer",
      expiryDate: "2025-02-10",
      quantity: 8,
      price: 45.0,
    },
    {
      id: 3,
      genericName: "Cetirizine",
      brandName: "Cetzine",
      strength: "10 mg",
      batchNo: "BCH-3099",
      manufacturer: "Sun Pharma",
      expiryDate: "2024-01-15",
      quantity: 20,
      price: 10.0,
    },
    {
      id: 4,
      genericName: "Ibuprofen",
      brandName: "Brufen",
      strength: "400 mg",
      batchNo: "BCH-7781",
      manufacturer: "Abbott",
      expiryDate: "2026-03-01",
      quantity: 0,
      price: 18.0,
    },
  ];

  const today = new Date();

  const getStatus = (item) => {
    const expiry = new Date(item.expiryDate);

    if (expiry < today) return "Expired";
    if (item.quantity === 0) return "Out of Stock";
    if (item.quantity < 10) return "Low Stock";
    return "In Stock";
  };

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = (status) => {
    switch (status) {
      case "Expired":
        return "bg-gray-300 text-gray-800";
      case "Low Stock":
        return "bg-red-100 text-red-700";
      case "Out of Stock":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar role="pharmacist" />

      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Management
          </h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <FaPlus /> Add Medicine
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center gap-3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by generic, brand or batch number..."
            className="w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3">Generic</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Strength</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Manufacturer</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price (LKR)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No inventory records found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {item.genericName}
                      </td>
                      <td className="px-4 py-3">{item.brandName}</td>
                      <td className="px-4 py-3">{item.strength}</td>
                      <td className="px-4 py-3">{item.batchNo}</td>
                      <td className="px-4 py-3">{item.manufacturer}</td>
                      <td className="px-4 py-3">{item.expiryDate}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
