import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const links = [
    { to: "/pharmacist/inventory", label: "Inventory" },
    { to: "/pharmacist/orders", label: "Orders" },
    { to: "/pharmacist/expired", label: "Expired Items" },
    { to: "/pharmacist/suppliers", label: "Suppliers" },
  ];

  useEffect(() => {
    api.get("/inventory").then(res => setItems(res.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar title="Pharmacist" links={links} />
      <div className="p-6 w-full">
        <h1 className="text-xl mb-4 font-bold">Inventory Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Category</th>
                <th className="py-2 px-4 border">Expiry Date</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{i.name}</td>
                  <td className="py-2 px-4 border">{i.quantity}</td>
                  <td className="py-2 px-4 border">{i.category || "-"}</td>
                  <td className="py-2 px-4 border">{i.expiryDate || "-"}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      i.quantity < 10 ? "bg-red-100 text-red-800" :
                      i.quantity < 20 ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {i.quantity < 10 ? "Low" : i.quantity < 20 ? "Medium" : "Good"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}