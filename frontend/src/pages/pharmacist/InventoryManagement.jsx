import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/api";

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    generic_name: "",
    brand_name: "",
    strength: "",
    batch_number: "",
    manufacturer: "",
    expiry_date: "",
    quantity: "",
    selling_price: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventoryData(res.data);
    } catch (error) {
      alert("Failed to load inventory");
    }
  };


  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      generic_name: "",
      brand_name: "",
      strength: "",
      batch_number: "",
      manufacturer: "",
      expiry_date: "",
      quantity: "",
      selling_price: "0",
    });
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;

    try {
      await api.delete(`/inventory/${id}`);
      alert("Medicine deleted successfully");
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert("Error deleting medicine");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.generic_name || !formData.quantity) {
      alert("Please fill in required fields");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/inventory/${editingId}`, formData);
        alert("Medicine updated successfully");
      } else {
        await api.post('/inventory', formData);
        alert("Medicine added successfully");
      }
      setShowModal(false);
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert("Error saving medicine");
    }
  };

  const today = new Date();

  const getStatus = (item) => {
    const expiry = new Date(item.expiry_date);

    if (expiry < today) return "Expired";
    if (item.quantity === 0) return "Out of Stock";
    if (item.quantity < 10) return "Low Stock";
    return "In Stock";
  };

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch_number.toLowerCase().includes(searchTerm.toLowerCase())
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
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
                        {item.generic_name}
                      </td>
                      <td className="px-4 py-3">{item.brand_name}</td>
                      <td className="px-4 py-3">{item.strength}</td>
                      <td className="px-4 py-3">{item.batch_number}</td>
                      <td className="px-4 py-3">{item.manufacturer}</td>
                      <td className="px-4 py-3">{item.expiry_date}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">
                        {item.selling_price ? Number(item.selling_price).toFixed(2) : "N/A"}
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
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 hover:text-red-800">
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center z-50">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? "Update Medicine" : "Add New Medicine"}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Generic Name *</label>
                  <input
                    type="text"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Paracetamol"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Brand Name</label>
                  <input
                    type="text"
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Panadol"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Strength</label>
                  <input
                    type="text"
                    name="strength"
                    value={formData.strength}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Batch Number</label>
                  <input
                    type="text"
                    name="batch_number"
                    value={formData.batch_number}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., BATCH001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., GSK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Selling Price</label>
                  <input
                    type="number"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
