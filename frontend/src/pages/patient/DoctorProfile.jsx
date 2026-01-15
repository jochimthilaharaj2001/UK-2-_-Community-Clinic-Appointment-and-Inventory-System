import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUserMd, FaStethoscope, FaClock, FaCalendarCheck } from 'react-icons/fa';

const DoctorProfile = () => {
    const { id } = useParams();

    // Mock Database
    const doctors = [
        {
            id: 1,
            name: 'Dr. Alice Smith',
            specialty: 'Cardiology',
            bio: 'Dr. Smith has over 15 years of experience in treating complex heart conditions. She is dedicated to patient-centered care and preventative cardiology.',
            education: 'MD - Harvard Medical School',
            availability: 'Mon - Fri: 9:00 AM - 5:00 PM',
            image: 'https://via.placeholder.com/150'
        },
        {
            id: 2,
            name: 'Dr. Bob Johnson',
            specialty: 'Dermatology',
            bio: 'Specializing in both cosmetic and medical dermatology, Dr. Johnson helps patients achieve healthy skin through personalized treatment plans.',
            education: 'MD - Stanford University',
            availability: 'Tue - Sat: 10:00 AM - 4:00 PM',
            image: 'https://via.placeholder.com/150'
        },
        // Fallback for demo
    ];

    const doctor = doctors.find(d => d.id === parseInt(id)) || doctors[0];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="bg-white p-2 rounded-full shadow-md">
                            <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                <FaUserMd className="text-6xl" />
                            </div>
                        </div>
                        <Link
                            to="/book-appointment"
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <FaCalendarCheck />
                            Book Appointment
                        </Link>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                    <p className="text-blue-600 font-medium text-lg mb-6">{doctor.specialty}</p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-gray-900 font-bold flex items-center gap-2 mb-2">
                                    <FaStethoscope className="text-blue-500" /> Biography
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {doctor.bio}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-bold flex items-center gap-2 mb-2">
                                    <FaUserMd className="text-blue-500" /> Education
                                </h3>
                                <p className="text-gray-600">
                                    {doctor.education}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h3 className="text-gray-900 font-bold flex items-center gap-2 mb-4">
                                <FaClock className="text-blue-500" /> Availability
                            </h3>
                            <p className="text-gray-600 font-medium mb-4">
                                {doctor.availability}
                            </p>
                            <div className="text-sm text-gray-500">
                                * Appointment slots are subject to availability. Please check the booking calendar for real-time slots.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
