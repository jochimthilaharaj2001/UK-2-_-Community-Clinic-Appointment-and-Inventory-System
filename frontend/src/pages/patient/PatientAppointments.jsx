import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaCalendarAlt, FaTimes, FaUserMd, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('All');
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Modal State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appRes, docRes] = await Promise.all([
                api.get('/patient/appointments'),
                api.get('/patient/doctors')
            ]);

            setAppointments(appRes.data.map(app => ({
                id: app.id,
                doctorName: app.doctor_name,
                specialization: app.doctor_specialization,
                date: new Date(app.appointment_date).toLocaleDateString(),
                time: app.appointment_time,
                status: app.status.charAt(0).toUpperCase() + app.status.slice(1)
            })));

            setDoctors(docRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Data fetch error:', error);
            toast.error('Failed to load live data');
            setLoading(false);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        if (!bookingDate || !bookingTime) return toast.error('Please select date and time');

        setBookingLoading(true);
        try {
            await api.post('/patient/appointments', {
                doctor_id: selectedDoctor.id,
                appointment_date: bookingDate,
                appointment_time: bookingTime,
                reason: 'General Consultation'
            });

            toast.success(`Request sent to ${selectedDoctor.name}`);
            setShowBookingModal(false);
            fetchData();
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Booking failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setBookingLoading(false);
        }
    };

    const cancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await api.put(`/patient/appointments/${id}/cancel`);
            toast.success('Appointment cancelled');
            fetchData();
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error('Failed to cancel');
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterSpecialization === 'All' || doc.specialization === filterSpecialization)
    );

    const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 p-6 ml-64">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
                    <p className="text-gray-600">Find doctors and manage your visits.</p>
                </div>

                {/* Search and Find Doctors */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Available Doctors</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search doctor or specialty..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={filterSpecialization}
                                onChange={(e) => setFilterSpecialization(e.target.value)}
                            >
                                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredDoctors.map(doc => (
                            <div key={doc.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition bg-gray-50 group">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FaUserMd size={32} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">{doc.name}</h3>
                                <p className="text-blue-600 font-medium text-sm mb-1">{doc.specialization}</p>
                                <p className="text-gray-500 text-xs mb-4">{doc.experience} Experience • {doc.education}</p>
                                <button
                                    onClick={() => {
                                        setSelectedDoctor(doc);
                                        setShowBookingModal(true);
                                    }}
                                    className="w-full py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Appointments List */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">My Appointments</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-gray-100">
                                    <th className="pb-4 font-semibold">DOCTOR</th>
                                    <th className="pb-4 font-semibold">DATE & TIME</th>
                                    <th className="pb-4 font-semibold">STATUS</th>
                                    <th className="pb-4 font-semibold text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {appointments.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition">
                                        <td className="py-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{app.doctorName}</p>
                                                <p className="text-xs text-gray-500">{app.specialization}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                <FaCalendarAlt className="text-blue-500" />
                                                {app.date} • {app.time}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {app.status === 'Pending' && (
                                                <button
                                                    onClick={() => cancelAppointment(app.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                                                    title="Cancel Appointment"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                You have no appointments scheduled.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-blue-600 p-6 text-white text-center relative">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white"
                            >
                                <FaTimes size={20} />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FaCalendarAlt size={24} />
                            </div>
                            <h3 className="text-2xl font-bold">Book Appointment</h3>
                            <p className="text-blue-100">With {selectedDoctor?.name}</p>
                        </div>

                        <form onSubmit={handleBookAppointment} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select Time</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                >
                                    <option value="">Choose a slot</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95 ${bookingLoading ? 'opacity-50' : ''}`}
                                >
                                    {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
