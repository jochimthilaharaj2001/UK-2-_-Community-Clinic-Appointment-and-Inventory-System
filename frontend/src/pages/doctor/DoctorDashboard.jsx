import Sidebar from "../../components/Sidebar";

export default function DoctorDashboard() {


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