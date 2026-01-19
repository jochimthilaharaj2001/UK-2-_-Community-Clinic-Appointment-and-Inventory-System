// components/DoctorProfileSummary.jsx
import { useState } from 'react';
import { FaUserMd, FaEdit, FaEnvelope, FaPhone, FaStethoscope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorProfileSummary = () => {
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('doctorProfile');
    if (storedProfile) {
      return JSON.parse(storedProfile);
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        return {
          name: user.name || 'Dr. Sarah Wilson',
          specialization: user.specialization || 'Cardiology',
          email: user.email || 'doctor@clinic.com',
          phone: '+1 (555) 123-4567',
          consultationFee: '$200'
        };
      }
    }
    return null;
  });

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4">
            <FaUserMd className="text-2xl text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
            <p className="text-blue-600 font-medium">{profile.specialization}</p>
          </div>
        </div>
        <Link
          to="/doctor/profile"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center"
        >
          <FaEdit className="mr-2" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center p-3 bg-white rounded-lg">
          <FaEnvelope className="text-gray-400 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium truncate">{profile.email}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white rounded-lg">
          <FaPhone className="text-gray-400 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{profile.phone}</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 bg-white rounded-lg">
          <FaStethoscope className="text-gray-400 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Consultation Fee</p>
            <p className="font-medium text-green-600">{profile.consultationFee}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileSummary;