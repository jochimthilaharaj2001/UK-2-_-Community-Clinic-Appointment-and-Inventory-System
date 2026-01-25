// pages/receptionist/PatientRegistration.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUserPlus,
  FaIdCard,
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaFileMedical,
  FaArrowLeft,
  FaSave
} from 'react-icons/fa';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(false);

  const [generatedId] = useState(`PAT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',

    // Contact Information
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',

    // Medical Information
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    currentMedications: '',

    // Insurance Information
    insuranceProvider: '',
    insuranceId: '',
    policyNumber: '',

    // Other
    primaryDoctor: '',
    referralSource: '',
    notes: ''
  });

  useEffect(() => {
    if (editId) {
      setIsEditMode(true);
      fetchPatientData(editId);
    }
  }, [editId]);

  const fetchPatientData = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/receptionist/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Map database field names to form field names
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          dateOfBirth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          gender: data.gender || '',
          maritalStatus: data.marital_status || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          emergencyContact: data.emergency_contact || '',
          emergencyPhone: data.emergency_phone || '',
          bloodGroup: data.blood_group || '',
          allergies: data.allergies || '',
          medicalHistory: data.medical_history || '',
          currentMedications: data.current_medications || '',
          insuranceProvider: data.insurance_provider || '',
          insuranceId: data.insurance_id || '',
          policyNumber: data.policy_number || '',
          primaryDoctor: data.primary_doctor || '',
          referralSource: data.referral_source || '',
          notes: data.notes || ''
        });
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('Please fill in required fields: First Name, Last Name, and Phone');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `http://localhost:5000/api/receptionist/patients/${editId}`
        : 'http://localhost:5000/api/receptionist/patients';

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert(isEditMode ? 'Patient information updated successfully!' : `Patient registered successfully!
Patient ID: ${data.patientId}
Name: ${formData.firstName} ${formData.lastName}
You can now schedule appointments for this patient.`);

        if (!isEditMode) {
          // Reset form for new registration
          setFormData({
            firstName: '', lastName: '', dateOfBirth: '', gender: '', maritalStatus: '',
            phone: '', email: '', address: '', emergencyContact: '', emergencyPhone: '',
            bloodGroup: '', allergies: '', medicalHistory: '', currentMedications: '',
            insuranceProvider: '', insuranceId: '', policyNumber: '',
            primaryDoctor: '', referralSource: '', notes: ''
          });

          // Optionally navigate to book appointment
          setTimeout(() => {
            navigate('/receptionist/appointments');
          }, 1500);
        } else {
          navigate('/receptionist/patients');
        }
      } else {
        const error = await response.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save patient information. Please check your connection.');
    }
  };

  const quickFillDemo = () => {
    setFormData({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-05-15',
      gender: 'male',
      maritalStatus: 'married',
      phone: '+1 (234) 567-8900',
      email: 'john.doe@email.com',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1 (234) 567-8901',
      bloodGroup: 'O+',
      allergies: 'Penicillin, Peanuts',
      medicalHistory: 'Hypertension, controlled with medication',
      currentMedications: 'Lisinopril 10mg daily',
      insuranceProvider: 'Blue Cross',
      insuranceId: 'BC123456789',
      policyNumber: 'POL-987654',
      primaryDoctor: 'Dr. Sarah Wilson',
      referralSource: 'Self-referred',
      notes: 'New patient, needs complete physical'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/receptionist/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Update Patient Information' : 'New Patient Registration'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? `Updating details for PAT${String(editId).padStart(3, '0')}` : 'Register a new patient in the system'}
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-2">
            {isEditMode ? `Patient ID: PAT${String(editId).padStart(3, '0')}` : `Temporary ID: ${generatedId}`}
          </div>
          <button
            onClick={quickFillDemo}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Fill Demo Data
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Form Sections */}
          <div className="space-y-8">
            {/* Section 1: Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUserPlus className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600">Basic details about the patient</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <FaBirthdayCake className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaPhone className="text-green-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                  <p className="text-gray-600">How to reach the patient</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="john.doe@email.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (234) 567-8901"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Medical Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FaFileMedical className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Medical Information</h2>
                  <p className="text-gray-600">Important medical details</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="List any allergies (medication, food, environmental)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Previous illnesses, surgeries, chronic conditions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="List current medications and dosages..."
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Insurance Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaIdCard className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Insurance Information</h2>
                  <p className="text-gray-600">Insurance and billing details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Blue Cross, Aetna, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance ID
                  </label>
                  <input
                    type="text"
                    name="insuranceId"
                    value={formData.insuranceId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Member ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Policy number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Doctor (if any)
                  </label>
                  <input
                    type="text"
                    name="primaryDoctor"
                    value={formData.primaryDoctor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Name"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaNotesMedical className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Additional Information</h2>
                  <p className="text-gray-600">Other relevant details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Source
                  </label>
                  <select
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select source</option>
                    <option value="self">Self-referred</option>
                    <option value="doctor">Doctor referral</option>
                    <option value="friend">Friend/Family</option>
                    <option value="online">Online search</option>
                    <option value="insurance">Insurance referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional information or special requirements..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
            >
              <FaSave />
              {isEditMode ? 'Update Patient Information' : 'Register Patient'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/receptionist/dashboard')}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">📝 Registration Guidelines</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• All fields marked with * are required for patient registration</li>
            <li>• Double-check phone numbers and emergency contact information</li>
            <li>• Verify insurance information before submitting</li>
            <li>• After registration, you can immediately schedule an appointment</li>
            <li>• Patient ID will be generated automatically and cannot be changed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;