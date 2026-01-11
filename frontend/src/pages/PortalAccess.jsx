import { Link } from 'react-router-dom';
import { FaUserMd, FaUser, FaPills, FaUserShield, FaUserNurse } from 'react-icons/fa';

const PortalAccess = () => {
  const portals = [
    {
      title: 'Admin Portal',
      description: 'Manage clinic operations, users, and system settings',
      icon: <FaUserShield className="text-4xl text-blue-600" />,
      path: '/login',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      title: 'Doctor Portal',
      description: 'View appointments, manage patients, and write prescriptions',
      icon: <FaUserMd className="text-4xl text-green-600" />,
      path: '#',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      disabled: true
    },
    {
      title: 'Pharmacist Portal',
      description: 'Manage inventory, process orders, and handle prescriptions',
      icon: <FaPills className="text-4xl text-purple-600" />,
      path: '/login',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      disabled: false
    },
    {
      title: 'Patient Portal',
      description: 'Book appointments, view medical records, and prescriptions',
      icon: <FaUser className="text-4xl text-orange-600" />,
      path: '#',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      disabled: true
    },
    {
      title: 'Receptionist Portal',
      description: 'Manage appointments, patient registration, and billing',
      icon: <FaUserNurse className="text-4xl text-pink-600" />,
      path: '#',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
      disabled: true
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
              <FaUserMd className="text-4xl text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Community Clinic Management System
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select a portal to access the system (Admin Portal Available)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {portals.map((portal, index) => (
            portal.disabled ? (
              <div
                key={index}
                className={`${portal.color} border-2 rounded-2xl p-8 flex flex-col items-center text-center opacity-60 cursor-not-allowed`}
              >
                <div className="mb-6">{portal.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{portal.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{portal.description}</p>
                <div className="text-gray-400 font-semibold">
                  <span>Coming Soon</span>
                </div>
              </div>
            ) : (
              <Link
                key={index}
                to={portal.path}
                className={`${portal.color} border-2 rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center`}
              >
                <div className="mb-6">{portal.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{portal.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{portal.description}</p>
                <div className="inline-flex items-center text-blue-600 font-semibold">
                  <span>Access Portal</span>
                  <span className="ml-2">→</span>
                </div>
              </Link>
            )
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Community Clinic System. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Currently only Admin Portal is available
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalAccess;