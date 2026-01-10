import Sidebar from '../../components/Sidebar';
import StatsCard from '../../components/StatsCard';

const PharmacistDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="pharmacist" />

      <main className="ml-64 flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Pharmacist Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Prescriptions" value="120" />
          <StatsCard title="Medicines Available" value="540" />
          <StatsCard title="Low Stock" value="14" />
          <StatsCard title="Dispensed Today" value="32" />
        </div>
      </main>
    </div>
  );
};

export default PharmacistDashboard;
