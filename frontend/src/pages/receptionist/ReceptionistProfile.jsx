import Sidebar from '../../components/Sidebar';

const receptionists = [
  {
    initials: 'J',
    name: 'Jesicca',
    employeeId: 'REC001',
    department: 'Front Desk',
    email: 'receptionist@clinic.com',
    contact: '+94 71 234 5678',
    color: 'bg-gradient-to-tr from-purple-400 to-pink-400', 
  },
  {
    initials: 'M',
    name: 'Malini',
    employeeId: 'REC002',
    department: 'Front Desk',
    email: 'receptionist23@clinic.com',
    contact: '+94 75 245 5753',
    color: 'bg-gradient-to-tr from-green-400 to-blue-400',
  },
];

const ReceptionistProfile = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 md:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Receptionist Profiles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {receptionists.map((rec) => (
            <div
              key={rec.employeeId}
              className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold ${rec.color}`}
              >
                {rec.initials}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-gray-800">{rec.name}</p>
                <p className="text-gray-600">Employee ID: {rec.employeeId}</p>
                <p className="text-gray-600">Department: {rec.department}</p>
                <p className="text-gray-600">Email: {rec.email}</p>
                <p className="text-gray-600">Contact: {rec.contact}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReceptionistProfile;
