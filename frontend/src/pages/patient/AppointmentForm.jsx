import React, { useState } from 'react';
import { FaCalendarPlus, FaCheckCircle, FaUserMd, FaClock, FaNotesMedical } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        doctorName: '',
        date: '',
        reason: ''
    });
    const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.doctorName || !formData.date || !formData.reason) {
            alert("Please fill in all fields."); // Simple fallback
            return;
        }

        setSubmitStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setSubmitStatus('success');
            // Reset form data if needed or keep it for the success message context
        }, 1500);
    };

    if (submitStatus === 'success') {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-5xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
                <p className="text-gray-600 mb-8">Your appointment has been successfully scheduled. We've sent a confirmation to your email.</p>

                <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Appointment Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaUserMd className="text-blue-500" />
                            <span className="font-medium">Doctor:</span>
                            <span>{formData.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaClock className="text-blue-500" />
                            <span className="font-medium">Date & Time:</span>
                            <span>{new Date(formData.date).toLocaleString()}</span>
                        </div>
                        <div className="flex items-start gap-3 text-gray-700">
                            <FaNotesMedical className="text-blue-500 mt-1" />
                            <span className="font-medium">Reason:</span>
                            <span>{formData.reason}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/my-appointments"
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        View My Appointments
                    </Link>
                    <button
                        onClick={() => {
                            setFormData({ doctorName: '', date: '', reason: '' });
                            setSubmitStatus('idle');
                        }}
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Book Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-2xl mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <FaCalendarPlus className="text-blue-600 text-2xl" />
                </div>
                Book Appointment
            </h2>
            <p className="text-gray-500 mb-8 ml-16">Fill out the form below to schedule your visit.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Select Doctor</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaUserMd />
                            </div>
                            <select
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Choose a specialist...</option>
                                <option value="Dr. Alice Smith">Dr. Alice Smith (Cardiology)</option>
                                <option value="Dr. Bob Johnson">Dr. Bob Johnson (Dermatology)</option>
                                <option value="Dr. John Doe">Dr. John Doe (Neurology)</option>
                                <option value="Dr. Emma Davis">Dr. Emma Davis (Pediatrics)</option>
                                <option value="Dr. James Wilson">Dr. James Wilson (Orthopedics)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Preferred Date & Time</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaClock />
                            </div>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Reason for Visit</label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                            <FaNotesMedical />
                        </div>
                        <textarea
                            name="reason"
                            rows="4"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            placeholder="Please briefly describe your symptoms or reason for the appointment..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitStatus === 'loading'}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitStatus === 'loading' ? (
                        <>Processing...</>
                    ) : (
                        <>Confirm Booking</>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AppointmentForm;
