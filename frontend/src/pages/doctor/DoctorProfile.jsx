// pages/doctor/DoctorProfile.jsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  FaUserMd, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcaseMedical,
  FaStethoscope,
  FaFileMedical,
  FaSave,
  FaEdit,
  FaTimes,
  FaUser,
  FaHospital
} from 'react-icons/fa';

const DoctorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initial doctor profile data
  const initialProfileData = {
    id: '3',
    name: 'Dr. S.Murugesan',
    email: 'dr.murugesan@siddhahospital.com',
    phone: '+94 77 123 4567',
    specialization: 'Siddha Medicine',
    department: 'Department of Siddha & Indigenous Medicine',
    qualifications: ['BSMS - Bachelor of Siddha Medicine and Surgery'],
    experience: '11 years',
    licenseNumber: 'SL-SMC/BSMS/23456',
    hospital: 'Government Siddha Teaching Hospital, Jaffna',
    address: 'No.45, Hospital Road, Jaffna,Sri Lanka',
    consultationFee: 'LKR 1,500',
    availability: 'Mon-Fri: 9 AM - 5 PM',
    bio: 'Experienced Siddha Medical Practitioner with over 11 years of clinical experience in treating chronic and lifestyle-related diseases using traditional Siddha medicine. Specialized in Varmam therapy, herbal and mineral-based formulations, and holistic patient care.Dedicated to preserving and practicing authentic Siddha medical traditions.',
    education: [
      { degree: 'BSMS', institution: 'University of Jaffna', year: '2011' },
      
    ],
    certifications: [
      'Registered Siddha Medical Practitioner - Sri Lanka Siddha Medical Council',
      'Certificate in Varmam Therapy - National Institute of Siddha'
    ],
    languages: ['Tamil','English', 'Sinhala'],
    joinDate: '2015-06-01'
  };

  useEffect(() => {
    // Always use initial data as base, merged with any stored changes
    const storedProfile = localStorage.getItem('doctorProfile');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Use initialProfileData as the base
    let profileToUse = {
      ...initialProfileData,
      ...(user && { name: user.name, email: user.email })
    };
    
    // Merge with stored profile if it exists (only merged fields, not replacing)
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      profileToUse = { ...profileToUse, ...parsedProfile };
    }
    
    setProfileData(profileToUse);
    setFormData(profileToUse);
  }, []);

  // Ensure formData is always initialized when profileData changes
  useEffect(() => {
    if (profileData && Object.keys(formData).length === 0) {
      setFormData(profileData);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], defaultValue]
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const handleSaveProfile = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update localStorage
      localStorage.setItem('doctorProfile', JSON.stringify(formData));
      
      // Update user data in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...user,
        name: formData.name,
        specialization: formData.specialization,
        department: formData.department
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setProfileData(formData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleCancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (!profileData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
            <p className="text-gray-600">Manage your professional profile and information</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <FaUserMd className="text-6xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center font-bold text-2xl"
                    />
                  ) : (
                    profileData.name
                  )}
                </h2>
                <p className="text-blue-600 font-medium mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                  ) : (
                    profileData.specialization
                  )}
                </p>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                  ) : (
                    profileData.department
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-3 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span>{profileData.email}</span>
                  )}
                </div>

                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-3 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span>{profileData.phone}</span>
                  )}
                </div>

                <div className="flex items-center text-gray-600">
                  <FaBriefcaseMedical className="mr-3 text-gray-400" />
                  <span>Experience: {profileData.experience}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaFileMedical className="mr-3 text-gray-400" />
                  <span>License: {profileData.licenseNumber}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FaHospital className="mr-3 text-gray-400" />
                  <span>{profileData.hospital}</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">Consultation Fee</div>
                  <div className="text-xl font-bold text-green-600">
                    {isEditing ? (
                      <input
                        type="text"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      profileData.consultationFee
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2" />
                Professional Bio
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="mr-2" />
                  Education
                </h3>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Education
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {formData.education?.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => handleArrayChange('education', index, {
                              ...edu,
                              degree: e.target.value
                            })}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => handleArrayChange('education', index, {
                              ...edu,
                              institution: e.target.value
                            })}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={edu.year}
                            onChange={(e) => handleArrayChange('education', index, {
                              ...edu,
                              year: e.target.value
                            })}
                            className="px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => removeArrayItem('education', index)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">Year: {edu.year}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaStethoscope className="mr-2" />
                  Certifications
                </h3>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('certifications', '')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Certification
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {formData.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => handleArrayChange('certifications', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-3"
                        />
                        <button
                          onClick={() => removeArrayItem('certifications', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-700">{cert}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Availability</h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-gray-700">{profileData.availability}</p>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    {formData.languages?.map((lang, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={lang}
                          onChange={(e) => handleArrayChange('languages', index, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button
                          onClick={() => removeArrayItem('languages', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('languages', '')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Language
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages?.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Address
              </h3>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-700">{profileData.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;