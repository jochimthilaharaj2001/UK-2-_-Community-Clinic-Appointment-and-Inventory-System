// pages/receptionist/BookAppointment.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaClock, 
  FaStethoscope, 
  FaNotesMedical,
  FaArrowLeft,
  FaCalendarPlus,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patientFromState = location.state?.patient;

  const [formData, setFormData] = useState({
    patientId: patientFromState?.id || '',
    patientName: patientFromState?.name || '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    doctor: '',
    appointmentType: 'consultation',
    notes: '',
    duration: '30',
    urgency: 'routine'
  });

  const [patients] = useState([
    { id: 1, name: 'John Smith', phone: '+1 (234) 567-8901' },
    { id: 2, name: 'Emily Johnson', phone: '+1 (234) 567-8902' },
    { id: 3, name: 'Michael Brown', phone: '+1 (234) 567-8903' },
    { id: 4, name: 'Sarah Miller', phone: '+1 (234) 567-8904' },
  ]);

  const doctors = [
    'Dr. Sarah Wilson - General Medicine',
    'Dr. Michael Chen - Cardiology',
    'Dr. Lisa Park - Pediatrics',
    'Dr. James Lee - Orthopedics',
    'Dr. Maria Garcia - Dermatology'
  ];

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Check-up',
    'Emergency',
    'Lab Test',
    'Procedure',
    'Vaccination',
    'Physical Exam'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: patient.name
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.date || !formData.time || !formData.doctor) {
      alert('Please fill in all required fields');
      return;
    }

    // Format time for display
    const timeString = new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // In real app, send to API
    console.log('Appointment booked:', formData);
    
    alert(`Appointment booked successfully!
Patient: ${formData.patientName}
Date: ${formData.date}
Time: ${timeString}
Doctor: ${formData.doctor}
Type: ${formData.appointmentType}`);

    // Navigate to calendar
    navigate('/receptionist/calendar');
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
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">Schedule a new appointment for a patient</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/receptionist/patient-search')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Find Patient
          </button>
          <button
            onClick={() => navigate('/receptionist/calendar')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            View Calendar
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCalendarPlus className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
              <p className="text-gray-600">Fill in the details to schedule an appointment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    Select Patient *
                  </div>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={(e) => handlePatientSelect(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {formData.patientName && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-gray-900">Selected Patient</p>
                        <p className="text-gray-600">{formData.patientName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date, Time & Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      Date *
                    </div>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      Time *
                    </div>
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <FaStethoscope className="text-gray-400" />
                      Duration
                    </div>
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
              </div>

              {/* Doctor & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Doctor *
                  </label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor, index) => (
                      <option key={index} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Appointment Type *
                  </label>
                  <select
                    name="appointmentType"
                    value={formData.appointmentType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {appointmentTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <FaNotesMedical className="text-gray-400" />
                    Notes & Instructions
                  </div>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any special instructions, symptoms, or notes for the doctor..."
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Urgency Level
                </label>
                <div className="flex gap-4">
                  {['routine', 'urgent', 'emergency'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="urgency"
                        value={level}
                        checked={formData.urgency === level}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/receptionist/dashboard')}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">📋 Appointment Scheduling Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-700">• Check doctor availability before scheduling</p>
              <p className="text-sm text-gray-700">• Allow 15 minutes buffer between appointments</p>
              <p className="text-sm text-gray-700">• Confirm patient's insurance coverage</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">• Send confirmation SMS/Email after booking</p>
              <p className="text-sm text-gray-700">• Note any special requirements</p>
              <p className="text-sm text-gray-700">• Check for conflicting appointments</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/receptionist/patient-search')}
            className="px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Find Another Patient
          </button>
          <button
            onClick={() => navigate('/receptionist/calendar')}
            className="px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            View Calendar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;