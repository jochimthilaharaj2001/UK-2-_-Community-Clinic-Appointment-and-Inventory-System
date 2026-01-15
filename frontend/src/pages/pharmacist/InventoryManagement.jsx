import Sidebar from '../../components/Sidebar';
import { FaPlus, FaEdit, FaBox, FaCalendarAlt } from 'react-icons/fa';

const InventoryManagement = () => {
  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      category: 'Analgesic',
      stock: '150 tablets',
      expiry: '2025-06-15',
      status: 'expired',
      batch: 'PCM001',
      supplier: 'MedSupply Co',
      cost: '$0.15',
      sell: '$0.25',
    },
    {
      id: 2,
      name: 'Ibuprofen 400mg',
      category: 'Anti-inflammatory',
      stock: '25 tablets',
      expiry: '2024-03-20',
      status: 'expired',
      batch: 'IBU002',
      supplier: 'HealthCorp',
      cost: '$0.20',
      sell: '$0.35',
    },
    {
      id: 3,
      name: 'Amoxicillin 250mg',
      category: 'Antibiotic',
      stock: '80 capsules',
      expiry: '2024-12-10',
      status: 'expired',
      batch: 'AMX003',
      supplier: 'PharmaTech',
      cost: '$0.45',
      sell: '$0.75',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="pharmacist" />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6">
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-500">
              Manage medicine stock, track expiry dates, and update inventory
            </p>
          </div>

          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            <FaPlus />
            Add Medicine
          </button>
        </div>

        {/* Inventory Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-1">Medicine Inventory</h2>
          <p className="text-gray-500 mb-4">
            Complete list of medicines with stock levels and expiry tracking
          </p>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3">Medicine</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Expiry</th>
                  <th className="pb-3">Batch</th>
                  <th className="pb-3">Supplier</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="border-b last:border-none">
                    
                    {/* Medicine */}
                    <td className="py-4">
                      <p className="font-medium text-gray-800">{med.name}</p>
                      <p className="text-sm text-gray-400">ID: {med.id}</p>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                        {med.category}
                      </span>
                    </td>

                    {/* Stock */}
                    <td>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaBox />
                        {med.stock}
                      </div>
                    </td>

                    {/* Expiry */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{med.expiry}</span>
                        <span className="ml-2 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                          expired
                        </span>
                      </div>
                    </td>

                    {/* Batch */}
                    <td>{med.batch}</td>

                    {/* Supplier */}
                    <td>{med.supplier}</td>

                    {/* Price */}
                    <td>
                      <p className="text-sm">Cost: {med.cost}</p>
                      <p className="text-sm">Sell: {med.sell}</p>
                    </td>

                    {/* Actions */}
                    <td>
                      <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100">
                        <FaEdit />
                        Edit
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default InventoryManagement;
