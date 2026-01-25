
import { useState, useEffect } from 'react';
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
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/patient/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.map(n => {
                    // Infer type from title if missing
                    let type = n.type || 'general';
                    if (!n.type) {
                        const titleLower = n.title?.toLowerCase() || '';
                        if (titleLower.includes('appointment')) type = 'appointment';
                        else if (titleLower.includes('prescription') || titleLower.includes('medication')) type = 'prescription';
                        else if (titleLower.includes('report') || titleLower.includes('result')) type = 'report';
                    }

                    return {
                        ...n,
                        time: n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now',
                        unread: !n.is_read, // Map DB is_read (1/0) to frontend unread (bool)
                        type: type,
                        link: getLinkForType(type)
                    };
                }));
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const getLinkForType = (type) => {
        switch (type?.toLowerCase()) {
            case 'appointment': return '/patient/appointments';
            case 'prescription': return '/patient/medical-records';
            default: return '#';
        }
    };

    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/patient/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        try {
            const token = localStorage.getItem('token');
            // Assuming backend supports this or iterating
            await fetch(`http://localhost:5000/api/patient/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = (id) => {
        // Optimistic delete
        setNotifications(notifications.filter(n => n.id !== id));
        // Add backend API call if endpoint exists
    };

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
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
                            onClick={markAllRead}
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
                                        if (n.link && n.link !== '#') navigate(n.link);
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
