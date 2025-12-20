import Sidebar from "../../components/Sidebar";

export default function DoctorDashboard() {
  const links = [
    { to: "/doctor/schedule", label: "My Schedule" },
    { to: "/doctor/patients", label: "My Patients" },
    { to: "/doctor/prescriptions", label: "Prescriptions" },
    { to: "/doctor/profile", label: "Profile" },
  ];

  return (
    <div className="flex">
      <Sidebar title="Doctor" links={links} />
      <div className="p-6">
        <h1 className="text-xl mb-4">Doctor Appointments</h1>
        {/* Add doctor-specific content here */}
      </div>
    </div>
  );
}