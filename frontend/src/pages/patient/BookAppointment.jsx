
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    FaSearch,
    FaCalendarAlt,
    FaClock,
    FaUserMd,
    FaRegCheckCircle,
    FaFilter
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('All');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [step, setStep] = useState(1); // 1: Search, 2: Details, 3: Success
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/patient/doctors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data.map(d => ({
                    ...d,
                    spec: d.specialization || 'General',
                    available: d.availability || 'Available',
                    rating: d.rating || 5.0
                })));
            }
        } catch (err) {
            console.error("Failed to fetch doctors", err);
        }
    };

    const handleBook = async () => {
        if (!selectedDoctor || !bookingDate || !bookingTime) return;
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/patient/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: selectedDoctor.id,
                    date: bookingDate,
                    time: bookingTime
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStep(3);
            } else {
                setError(data.message || 'Failed to book appointment');
            }
        } catch (err) {
            console.error(err);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const specializations = ['All', ...new Set(doctors.map(d => d.spec))];

    const filteredDoctors = doctors.filter(doc =>
        (doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.spec?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedSpec === 'All' || doc.spec === selectedSpec)
    );

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
                    <p className="text-gray-600 mb-8">Schedule a visit with our expert medical team.</p>

                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                            <div className="p-6 bg-indigo-600 text-white">
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-3 top-3.5 text-indigo-300" />
                                        <input
                                            type="text"
                                            placeholder="Search by doctor name or specialization..."
                                            className="w-full pl-10 pr-4 py-3 bg-indigo-500 border-none rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-white transition"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaFilter className="text-white opacity-60" />
                                        <select
                                            className="px-4 py-3 bg-indigo-500 border-none rounded-xl text-white font-bold focus:ring-2 focus:ring-white transition cursor-pointer"
                                            value={selectedSpec}
                                            onChange={(e) => setSelectedSpec(e.target.value)}
                                        >
                                            {specializations.map(s => (
                                                <option key={s} value={s} className="text-gray-800">{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                                        <div key={doc.id} className="p-4 border border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-lg transition group">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-100 transition">
                                                    <FaUserMd className="text-gray-400 group-hover:text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{doc.name}</h3>
                                                    <p className="text-indigo-600 text-sm font-medium">{doc.spec}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-1"><FaCalendarAlt size={12} /> {doc.available}</span>
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold">★ {doc.rating}</span>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                                                className="w-full py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-xl font-bold transition shadow-sm"
                                            >
                                                Select Doctor
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="text-center col-span-2 text-gray-500 py-8">No doctors found.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-2">
                                ← Back to Search
                            </button>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-4xl text-indigo-600">
                                    <FaUserMd />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedDoctor?.name}</h2>
                                    <p className="text-indigo-600 font-medium">{selectedDoctor?.spec}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Date</label>
                                    <div className="relative">
                                        <FaCalendarAlt className="absolute left-4 top-4 text-gray-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Time</label>
                                    <div className="relative">
                                        <FaClock className="absolute left-4 top-4 text-gray-400" />
                                        <select
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                            value={bookingTime}
                                            onChange={(e) => setBookingTime(e.target.value)}
                                        >
                                            <option value="">Choose a slot</option>
                                            <option value="09:00:00">09:00 AM</option>
                                            <option value="10:00:00">10:00 AM</option>
                                            <option value="11:00:00">11:00 AM</option>
                                            <option value="14:00:00">02:00 PM</option>
                                            <option value="15:00:00">03:00 PM</option>
                                            <option value="16:00:00">04:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={!bookingDate || !bookingTime || loading}
                                onClick={handleBook}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Confirm Appointment Request'}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-scaleIn">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-6xl text-green-500 mx-auto mb-8">
                                <FaRegCheckCircle />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Request Successful!</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Your appointment request with <span className="font-bold text-indigo-600">{selectedDoctor?.name}</span> has been sent.
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left max-w-sm mx-auto">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-bold text-gray-800">{bookingDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Time</span>
                                    <span className="font-bold text-gray-800">{bookingTime}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/patient/dashboard')}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                            >
                                Go To Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
