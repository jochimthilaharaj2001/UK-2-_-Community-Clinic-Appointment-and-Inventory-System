import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBox, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: 'Paracetamol 500mg', 
      category: 'Pain Relief', 
      stock: 1250,
      unit: 'tablets',
      reorderLevel: 200,
      price: 0.25,
      supplier: 'MediCare Supplies',
      expiryDate: '2025-06-30',
      status: 'in-stock',
      location: 'A1-05'
    },
    { 
      id: 2, 
      name: 'Amoxicillin 250mg', 
      category: 'Antibiotics', 
      stock: 580,
      unit: 'capsules',
      reorderLevel: 300,
      price: 0.45,
      supplier: 'PharmaCorp',
      expiryDate: '2024-09-15',
      status: 'in-stock',
      location: 'B2-12'
    },
    { 
      id: 3, 
      name: 'Insulin Syringes', 
      category: 'Medical Supplies', 
      stock: 85,
      unit: 'pieces',
      reorderLevel: 100,
      price: 1.20,
      supplier: 'MedEquip Inc.',
      expiryDate: '2026-12-31',
      status: 'low-stock',
      location: 'C3-08'
    },
    { 
      id: 4, 
      name: 'Ibuprofen 400mg', 
      category: 'Pain Relief', 
      stock: 2300,
      unit: 'tablets',
      reorderLevel: 500,
      price: 0.30,
      supplier: 'MediCare Supplies',
      expiryDate: '2025-03-20',
      status: 'in-stock',
      location: 'A1-07'
    },
    { 
      id: 5, 
      name: 'Blood Pressure Monitor', 
      category: 'Equipment', 
      stock: 12,
      unit: 'units',
      reorderLevel: 5,
      price: 89.99,
      supplier: 'HealthTech Devices',
      expiryDate: '2027-01-31',
      status: 'in-stock',
      location: 'D4-02'
    },
    { 
      id: 6, 
      name: 'COVID-19 Test Kit', 
      category: 'Diagnostics', 
      stock: 45,
      unit: 'kits',
      reorderLevel: 50,
      price: 8.50,
      supplier: 'BioTest Labs',
      expiryDate: '2024-05-31',
      status: 'expiring-soon',
      location: 'E5-11'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    unit: '',
    reorderLevel: '',
    price: '',
    supplier: '',
    expiryDate: '',
    location: ''
  });

  const filteredAndSortedInventory = [...inventory]
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'stock') {
        return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
      }
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'expiring-soon': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pain Relief': 'bg-blue-100 text-blue-800',
      'Antibiotics': 'bg-purple-100 text-purple-800',
      'Medical Supplies': 'bg-green-100 text-green-800',
      'Equipment': 'bg-indigo-100 text-indigo-800',
      'Diagnostics': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const status = formData.stock <= formData.reorderLevel 
      ? 'low-stock' 
      : new Date(formData.expiryDate) < new Date(Date.now() + 90 * 86400000)
        ? 'expiring-soon'
        : 'in-stock';

    const newItem = {
      id: inventory.length + 1,
      ...formData,
      stock: parseInt(formData.stock),
      reorderLevel: parseInt(formData.reorderLevel),
      price: parseFloat(formData.price),
      status: status
    };
    
    setInventory([...inventory, newItem]);
    setShowForm(false);
    setFormData({
      name: '',
      category: '',
      stock: '',
      unit: '',
      reorderLevel: '',
      price: '',
      supplier: '',
      expiryDate: '',
      location: ''
    });
    alert('Inventory item added successfully!');
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <FaSort className="text-gray-400 ml-1" />;
    return sortOrder === 'asc' 
      ? <FaSortUp className="text-blue-600 ml-1" /> 
      : <FaSortDown className="text-blue-600 ml-1" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage medical supplies, drugs, and equipment</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Total Items</h3>
                <p className="text-3xl font-bold text-green-700">{inventory.length}</p>
              </div>
              <FaBox className="text-3xl text-green-600" />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yellow-900 mb-2">Low Stock</h3>
                <p className="text-3xl font-bold text-yellow-700">
                  {inventory.filter(item => item.status === 'low-stock').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-3xl text-yellow-600" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Total Value</h3>
                <p className="text-3xl font-bold text-blue-700">
                  ${inventory.reduce((acc, item) => acc + (item.stock * item.price), 0).toFixed(2)}
                </p>
              </div>
              <FaBox className="text-3xl text-blue-600" />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Expiring Soon</h3>
                <p className="text-3xl font-bold text-red-700">
                  {inventory.filter(item => item.status === 'expiring-soon').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-3xl text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory by name, category, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Equipment">Equipment</option>
                <option value="Diagnostics">Diagnostics</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="expiring-soon">Expiring Soon</option>
              </select>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Inventory Item</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Paracetamol 500mg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Pain Relief">Pain Relief</option>
                      <option value="Antibiotics">Antibiotics</option>
                      <option value="Medical Supplies">Medical Supplies</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Diagnostics">Diagnostics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Unit</option>
                      <option value="tablets">Tablets</option>
                      <option value="capsules">Capsules</option>
                      <option value="pieces">Pieces</option>
                      <option value="units">Units</option>
                      <option value="kits">Kits</option>
                      <option value="bottles">Bottles</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimum stock level"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Unit ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 0.25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storage Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., A1-05"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                  >
                    Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Item Name
                      <SortIcon column="name" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock
                      <SortIcon column="stock" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      <SortIcon column="price" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.supplier} • {item.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.stock.toLocaleString()} {item.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Reorder: {item.reorderLevel}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${item.price.toFixed(2)}/{item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: ${(item.stock * item.price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          Expires: {item.expiryDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`Editing ${item.name}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this item?')) {
                              setInventory(inventory.filter(i => i.id !== item.id));
                              alert('Item deleted successfully');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => {
                            const newStock = parseInt(prompt(`Enter new stock quantity for ${item.name}:`, item.stock));
                            if (!isNaN(newStock) && newStock >= 0) {
                              const status = newStock <= item.reorderLevel 
                                ? 'low-stock' 
                                : new Date(item.expiryDate) < new Date(Date.now() + 90 * 86400000)
                                  ? 'expiring-soon'
                                  : 'in-stock';
                              setInventory(inventory.map(i => 
                                i.id === item.id ? { ...i, stock: newStock, status } : i
                              ));
                              alert('Stock updated successfully');
                            }
                          }}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-600 rounded text-xs"
                        >
                          Update Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredAndSortedInventory.length}</span> of <span className="font-medium">{inventory.length}</span> items
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {inventory
              .filter(item => item.status === 'low-stock')
              .map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Current stock: {item.stock} {item.unit} • Reorder level: {item.reorderLevel}
                    </p>
                  </div>
                  <button
                    onClick={() => alert(`Ordering more ${item.name} from ${item.supplier}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                  >
                    Reorder Now
                  </button>
                </div>
              ))}
            
            {inventory.filter(item => item.status === 'low-stock').length === 0 && (
              <p className="text-gray-600 text-center py-4">No low stock items at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;