import { Link } from "react-router-dom";

export default function PortalAccess() {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-4xl w-full">
        
        <h1 className="text-3xl font-bold text-center text-sky-700 mb-6">
          Community Clinic System
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Select your portal to log in
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/admin"
            className="block text-center bg-sky-50 border border-sky-200 rounded-lg p-6 hover:bg-sky-100 transition"
          >
            Admin Portal
          </Link>

          <Link
            to="/doctor"
            className="block text-center bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition"
          >
            Doctor Portal
          </Link>

          <Link
            to="/patient"
            className="block text-center bg-orange-50 border border-orange-200 rounded-lg p-6 hover:bg-orange-100 transition"
          >
            Patient Portal
          </Link>

          <Link
            to="/receptionist"
            className="block text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:bg-yellow-100 transition"
          >
            Receptionist Portal
          </Link>

          <Link
            to="/pharmacist"
            className="block text-center bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition"
          >
            Pharmacist Portal
          </Link>

        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          © 2025 Rural Siddha Hospital Tellipalai
        </p>
      </div>
    </div>
  );
}
