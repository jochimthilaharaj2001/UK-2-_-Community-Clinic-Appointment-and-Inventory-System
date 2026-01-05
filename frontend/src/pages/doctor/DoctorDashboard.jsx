import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaCalendarAlt, FaUserFriends, FaPills } from "react-icons/fa";


export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("Dr. Priya Somasundaram");
  const [role, setRole] = useState("Siddha Medicine Specialist");
  const [showModal, setShowModal] = useState(false);

  const links = [
    { to: "/doctor/dashboard", label: "Dashboard", icon: <FaCalendarAlt /> },
    { to: "/doctor/patients", label: "Patients", icon: <FaUserFriends /> },
    { to: "/doctor/inventory", label: "Medicine Inventory", icon: <FaPills /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar
        title="Doctor"
        links={links}
        doctorName={doctorName}
        doctorRole={role}
      />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-blue-700">Doctor Dashboard</h1>
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/150?img=12"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium">{doctorName}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Edit Profile
            </button>
          </div>
        </header>

        {/* Simple Dashboard Card */}
        <section className="mt-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold text-blue-700">Today's Appointments</h2>
            <p className="text-3xl font-bold text-blue-700 mt-2">8</p>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">
              Edit Profile
            </h2>
            <form className="space-y-4">
              <div>
                <label className="font-semibold">Full Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="font-semibold">Specialization</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
