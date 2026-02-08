import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaVideo, FaMicrophone, FaPhoneSlash, FaCommentAlt, FaUser, FaClock, FaCalendarAlt } from 'react-icons/fa';

const DoctorTeleconsult = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState(null);

    useEffect(() => {
        fetchTeleconsultAppointments();
    }, []);

    const fetchTeleconsultAppointments = async () => {
        try {
            setLoading(true);
            // In a real app, we might have a specific flag for teleconsultations
            // For now, we fetch all today's appointments for simplicity
            const res = await api.get('/doctor/appointments?date=' + new Date().toISOString().split('T')[0]);
            setAppointments(res.data);
        } catch (error) {
            console.error('Error fetching teleconsult appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const startSession = (appointment) => {
        setActiveSession(appointment);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Teleconsultation</h1>
                        <p className="text-gray-600">Connect with your patients remotely</p>
                    </div>
                </div>

                {!activeSession ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Appointment List */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-600" />
                                Today's Remote Sessions
                            </h2>
                            <div className="space-y-4">
                                {appointments.length > 0 ? appointments.map((appointment) => (
                                    <div key={appointment.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {appointment.patient_name?.[0] || 'P'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{appointment.patient_name}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <FaClock className="text-xs" />
                                                        {appointment.appointment_time}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => startSession(appointment)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                <FaVideo />
                                                Join Room
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>No remote appointments scheduled for today.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tips/Info */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-4">Guidelines for Virtual Consultation</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-white/20 p-1 rounded">✔</div>
                                        <p>Ensure you have a stable high-speed internet connection.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-white/20 p-1 rounded">✔</div>
                                        <p>Use a quiet, well-lit environment for the consultation.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-white/20 p-1 rounded">✔</div>
                                        <p>Verify patient identity at the beginning of the session.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-white/20 p-1 rounded">✔</div>
                                        <p>Document the clinical notes precisely like an in-person visit.</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                ) : (
                    /* Video Call UI Simulation */
                    <div className="bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
                        <div className="flex-1 relative flex items-center justify-center">
                            {/* Main Video (Patient Placeholder) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                <div className="text-center text-white">
                                    <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                                        {activeSession.patient_name?.[0]}
                                    </div>
                                    <h3 className="text-xl font-medium">{activeSession.patient_name}</h3>
                                    <p className="text-gray-400">Waiting for patient to join...</p>
                                </div>
                            </div>

                            {/* Self View (Doctor Placeholder) */}
                            <div className="absolute bottom-6 right-6 w-48 h-32 bg-gray-800 border-2 border-white/20 rounded-xl overflow-hidden shadow-lg">
                                <div className="w-full h-full flex items-center justify-center bg-blue-900/20">
                                    <FaUser className="text-blue-400 text-2xl" />
                                </div>
                            </div>

                            {/* Controls Overlay */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
                                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                                    <FaMicrophone size={20} />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                                    <FaVideo size={20} />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                                    <FaCommentAlt size={20} />
                                </button>
                                <button
                                    onClick={() => setActiveSession(null)}
                                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105"
                                >
                                    <FaPhoneSlash size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorTeleconsult;
