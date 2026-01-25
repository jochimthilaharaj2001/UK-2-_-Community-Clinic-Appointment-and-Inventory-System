import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    FaCalendarAlt,
    FaClock,
    FaUserMd,
    FaEllipsisV,
    FaFilter,
    FaSearch,
    FaTimes
} from 'react-icons/fa';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5000/api/patient/appointments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    if (Array.isArray(data)) {
                        const mappedData = data.map(apt => ({
                            ...apt,
                            spec: apt.type,
                            type: 'Consultation',
                            status: apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1).toLowerCase() : 'Pending',
                            date: apt.date ? new Date(apt.date).toISOString().split('T')[0] : null
                        }));
                        setAppointments(mappedData);
                    } else {
                        setAppointments([]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch appointments", err);
            }
        };

        fetchAppointments();
    }, []);

    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [activeActionId, setActiveActionId] = useState(null);
    const [selectedApt, setSelectedApt] = useState(null);
    const [rescheduleApt, setRescheduleApt] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [newSchedule, setNewSchedule] = useState({ date: '', time: '' });

    const handleCancel = (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            setAppointments(appointments.map(apt =>
                apt.id === id ? { ...apt, status: 'Cancelled' } : apt
            ));
            setActiveActionId(null);
        }
    };

    const handleDownloadReceipt = (apt) => {
        setDownloading(true);
        import('jspdf').then(({ jsPDF }) => {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229);
            doc.text("COMMUNITY CLINIC", 105, 20, { align: "center" });
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Payment Receipt", 105, 30, { align: "center" });
            doc.line(20, 35, 190, 35);
            doc.setFontSize(12);
            doc.text(`Doctor: ${apt.doctor}`, 20, 50);
            doc.text(`Date: ${apt.date}`, 20, 60);
            doc.text(`Type: ${apt.type}`, 20, 70);
            doc.text(`Amount: $50.00`, 20, 80);
            doc.text(`Status: Paid`, 20, 90);
            doc.save(`Receipt-${apt.id}.pdf`);
            setDownloading(false);
            setActiveActionId(null);
        });
    };

    const handleReschedule = (e) => {
        e.preventDefault();
        setAppointments(appointments.map(apt =>
            apt.id === rescheduleApt.id ? { ...apt, date: newSchedule.date, time: newSchedule.time } : apt
        ));
        setRescheduleApt(null);
        alert("Appointment rescheduled successfully!");
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesFilter = filter === 'All' || apt.status === filter;
        const matchesSearch = apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.type.toLowerCase().includes(searchTerm.toLowerCase());

        const aptDate = new Date(apt.date);
        const matchesStart = !dateRange.start || aptDate >= new Date(dateRange.start);
        const matchesEnd = !dateRange.end || aptDate <= new Date(dateRange.end);

        return matchesFilter && matchesSearch && matchesStart && matchesEnd;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
                            <p className="text-gray-600">Manage and view your upcoming and past clinic visits.</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by doctor or visit type..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold transition ${showAdvanced ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <FaFilter /> Advanced Filter
                                </button>

                                {showAdvanced && (
                                    <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-5 animate-scaleIn">
                                        <div className="flex justify-between items-center mb-4 text-gray-800">
                                            <h3 className="font-bold">Filter by Date</h3>
                                            <button onClick={() => setShowAdvanced(false)}><FaTimes size={12} /></button>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">From Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                                    value={dateRange.start}
                                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">To Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                                    value={dateRange.end}
                                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                                />
                                            </div>
                                            <button
                                                onClick={() => setDateRange({ start: '', end: '' })}
                                                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition"
                                            >
                                                Reset Dates
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-extrabold">
                                        <th className="px-6 py-4">Doctor</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredAppointments.length > 0 ? (
                                        filteredAppointments.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-gray-50 transition group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                            {apt.doctor.split(' ').pop().charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{apt.doctor}</p>
                                                            <p className="text-xs text-gray-400">{apt.spec}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                                            <FaCalendarAlt className="text-gray-300" size={12} /> {apt.date}
                                                        </span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <FaClock className="text-gray-300" size={12} /> {apt.time}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        {apt.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getStatusColor(apt.status)}`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right relative">
                                                    <button
                                                        onClick={() => setActiveActionId(activeActionId === apt.id ? null : apt.id)}
                                                        className={`p-2 rounded-lg transition ${activeActionId === apt.id ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                                                    >
                                                        <FaEllipsisV />
                                                    </button>

                                                    {activeActionId === apt.id && (
                                                        <div className="absolute right-6 top-14 w-44 bg-white rounded-xl shadow-2xl border border-gray-50 z-50 overflow-hidden animate-scaleIn">
                                                            <div className="p-1">
                                                                <button
                                                                    onClick={() => { setSelectedApt(apt); setActiveActionId(null); }}
                                                                    className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition"
                                                                >
                                                                    View Details
                                                                </button>
                                                                {(apt.status === 'Confirmed' || apt.status === 'Pending') && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => { setRescheduleApt(apt); setNewSchedule({ date: apt.date, time: apt.time }); setActiveActionId(null); }}
                                                                            className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition"
                                                                        >
                                                                            Reschedule
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleCancel(apt.id)}
                                                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                        >
                                                                            Cancel Appointment
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {apt.status === 'Completed' && (
                                                                    <button
                                                                        onClick={() => handleDownloadReceipt(apt)}
                                                                        disabled={downloading}
                                                                        className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                                                                    >
                                                                        {downloading ? 'Downloading...' : 'Download Receipt'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                                                No appointments found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedApt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
                            <button onClick={() => setSelectedApt(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <FaTimes className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl text-indigo-600 shadow-sm">
                                    <FaUserMd />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800">{selectedApt.doctor}</h3>
                                    <p className="text-indigo-600 font-semibold">{selectedApt.spec}</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${getStatusColor(selectedApt.status)}`}>
                                    {selectedApt.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest mb-1">Date</p>
                                    <p className="font-bold text-gray-800 flex items-center gap-2"><FaCalendarAlt className="text-indigo-500" /> {selectedApt.date}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl">
                                    <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest mb-1">Time</p>
                                    <p className="font-bold text-gray-800 flex items-center gap-2"><FaClock className="text-indigo-500" /> {selectedApt.time}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-widest mb-1">Visit Type</p>
                                <p className="font-bold text-gray-800 uppercase tracking-wider">{selectedApt.type}</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex gap-4">
                                <button
                                    onClick={() => setSelectedApt(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                >
                                    Close
                                </button>
                                {(selectedApt.status === 'Confirmed' || selectedApt.status === 'Pending') && (
                                    <button
                                        onClick={() => handleCancel(selectedApt.id)}
                                        className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                                    >
                                        Cancel Visit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleApt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Reschedule</h2>
                            <button onClick={() => setRescheduleApt(null)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <FaTimes className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleReschedule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select New Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition"
                                    value={newSchedule.date}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select New Time</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition"
                                    value={newSchedule.time}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                                >
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setRescheduleApt(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                                >
                                    Confirm
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
