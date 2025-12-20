import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminDashboard() {
  const [data, setData] = useState({});
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/doctors", label: "Doctor Management" },
    { to: "/admin/inventory", label: "Inventory Overview" },
    { to: "/admin/reports", label: "Reports" },
  ];

  useEffect(() => {
    api.get("/admin/dashboard").then(res => setData(res.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar title="Admin" links={links} />
      <div className="p-6">
        <h1 className="text-2xl mb-4">Dashboard</h1>
        <p>Appointments: {data.appointments}</p>
        <p>Patients: {data.patients}</p>
        <p>Inventory Items: {data.inventory}</p>
      </div>
    </div>
  );
}

