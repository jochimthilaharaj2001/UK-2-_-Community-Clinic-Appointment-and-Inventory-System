import Sidebar from '../../components/Sidebar';

const DoctorManagement = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Doctor Management</h1>
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-600">Doctor management page - Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;