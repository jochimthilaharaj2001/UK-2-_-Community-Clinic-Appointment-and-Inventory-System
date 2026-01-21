import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    FaBell,
    FaCheckCircle,
    FaFilePrescription,
    FaClock,
    FaTrashAlt,
    FaArrowLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Appointment Confirmed', message: 'Your appointment with Dr. Jane Smith is confirmed for Jan 25th.', time: '2 mins ago', unread: true, type: 'appointment', link: '/patient/appointments' },
        { id: 2, title: 'New Prescription', message: 'Dr. Smith added a new prescription for your checkup.', time: '1 hour ago', unread: true, type: 'prescription', link: '/patient/medical-records' },
        { id: 3, title: 'Reminder', message: 'Take your Amoxicillin at 8:00 PM.', time: '3 hours ago', unread: false, type: 'reminder', link: '/patient/medical-records' },
        { id: 4, title: 'Report Ready', message: 'Your Laboratory results are now available for viewing.', time: '1 day ago', unread: false, type: 'report', link: '/patient/medical-records' },
        { id: 5, title: 'Profile Updated', message: 'Your password was changed successfully.', time: '2 days ago', unread: false, type: 'profile', link: '/patient/profile' }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'appointment': return <FaCheckCircle className="text-green-500" />;
            case 'prescription': return <FaFilePrescription className="text-indigo-500" />;
            case 'reminder': return <FaClock className="text-orange-500" />;
            case 'report': return <FaBell className="text-blue-500" />;
            default: return <FaBell className="text-gray-500" />;
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md text-gray-400 hover:text-indigo-600 transition"
                            >
                                <FaArrowLeft />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                                <p className="text-gray-600">Updated alerts and clinical updates.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition shadow-sm"
                        >
                            Mark All Read
                        </button>
                    </div>

                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => {
                                        markAsRead(n.id);
                                        navigate(n.link);
                                    }}
                                    className={`group flex items-start gap-5 p-6 rounded-2xl border transition cursor-pointer ${n.unread ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-50' : 'bg-gray-50/50 border-transparent text-gray-500'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition ${n.unread ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-400'}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-bold transition ${n.unread ? 'text-gray-800 text-lg' : 'text-gray-600'}`}>
                                                {n.title}
                                                {n.unread && <span className="ml-2 inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>}
                                            </h3>
                                            <span className="text-xs font-medium text-gray-400">{n.time}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed">{n.message}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(n.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl text-gray-300 mx-auto mb-4">
                                    <FaBell />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">All caught up!</h3>
                                <p className="text-gray-500">You have no new notifications.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
