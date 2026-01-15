import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaFilter, FaHistory, FaBan } from 'react-icons/fa';

const MyAppointments = () => {
    // Mock Appointments State
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            doctor: 'Dr. Alice Smith',
            specialty: 'Cardiology',
            date: '2025-01-20',
            time: '10:00 AM',
            status: 'Confirmed',
            reason: 'Routine Checkup'
        },
        {
            id: 2,
            doctor: 'Dr. Bob Johnson',
            specialty: 'Dermatology',
            date: '2025-01-25',
            time: '02:30 PM',
            status: 'Pending',
            reason: 'Skin Rash'
        },
        {
            id: 3,
            doctor: 'Dr. John Doe',
            specialty: 'Neurology',
            date: '2024-12-15',
            time: '11:00 AM',
            status: 'Completed',
            reason: 'Migraine Consultation'
        },
        {
            id: 4,
            doctor: 'Dr. Emily White',
            specialty: 'Pediatrics',
            date: '2024-11-05',
            time: '09:00 AM',
            status: 'Cancelled',
            reason: 'Fever'
        }
    ]);

    const [filter, setFilter] = useState('all'); // all, upcoming, history
    const [dateFilter, setDateFilter] = useState('');

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            setAppointments(appointments.map(apt =>
                apt.id === id ? { ...apt, status: 'Cancelled' } : apt
            ));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    // Filter Logic
    const filteredAppointments = appointments.filter(apt => {
        const matchesDate = dateFilter ? apt.date === dateFilter : true;

        if (!matchesDate) return false;

        const isUpcoming = new Date(apt.date) >= new Date() && apt.status !== 'Cancelled' && apt.status !== 'Completed';

        if (filter === 'upcoming') {
            return isUpcoming;
        } else if (filter === 'history') {
            return !isUpcoming; // Past, Completed, or Cancelled
        }
        return true;
    });

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaCalendarAlt className="text-blue-600" />
                        My Appointments
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your upcoming visits and view history.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('history')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'history' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            {/* Date Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <FaFilter className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {dateFilter && (
                    <button
                        onClick={() => setDateFilter('')}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="grid gap-6">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg hidden sm:block">
                                    <FaUserMd className="text-2xl text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{apt.doctor}</h3>
                                    <p className="text-sm text-blue-600 font-medium">{apt.specialty}</p>
                                    <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
                                        <span className="flex items-center gap-1"><FaCalendarAlt /> {apt.date}</span>
                                        <span className="flex items-center gap-1"><FaClock /> {apt.time}</span>
                                    </div>
                                    <p className="mt-2 text-gray-500 italic text-sm">"{apt.reason}"</p>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col items-end gap-3 w-full md:w-auto">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(apt.status)}`}>
                                    {apt.status}
                                </span>
                                {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                                    <button
                                        onClick={() => handleCancel(apt.id)}
                                        className="inline-flex items-center gap-2 text-red-500 text-sm hover:text-red-700 font-medium transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                    >
                                        <FaBan /> Cancel Appointment
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <FaHistory className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No appointments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
