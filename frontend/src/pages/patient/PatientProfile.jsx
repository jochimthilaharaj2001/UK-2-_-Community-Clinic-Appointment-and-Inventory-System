
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBirthdayCake,
    FaEdit,
    FaSave,
    FaLock,
    FaCheckCircle
} from 'react-icons/fa';

const PatientProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        bloodType: '',
        profileImage: null
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordStatus, setPasswordStatus] = useState(null); // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/patient/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser({
                    ...data,
                    dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : ''
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/patient/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            if (res.ok) {
                setIsEditing(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setPasswordStatus(null);

        // Basic Client-side Validation
        if (passwords.new !== passwords.confirm) {
            setPasswordStatus('error');
            setErrorMessage('New passwords do not match!');
            return;
        }

        if (passwords.new.length < 6) {
            setPasswordStatus('error');
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/patient/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordStatus('success');
                setPasswords({ current: '', new: '', confirm: '' });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordStatus(null);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }, 1500);
            } else {
                setPasswordStatus('error');
                setErrorMessage(data.message || 'Failed to update password');
            }
        } catch (err) {
            setPasswordStatus('error');
            setErrorMessage('Server connection error');
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100"
                                >
                                    <FaSave /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {showSuccess && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl flex items-center gap-3 animate-slideDown">
                            <FaCheckCircle /> Action completed successfully!
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                                <div className="relative inline-block mb-6">
                                    <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-5xl text-indigo-600 mx-auto border-4 border-indigo-50 shadow-inner overflow-hidden">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                id="photo-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                            />
                                            <button
                                                onClick={() => document.getElementById('photo-upload').click()}
                                                className="absolute bottom-0 right-0 p-2 bg-white border border-gray-200 rounded-full text-indigo-600 shadow-md hover:scale-110 transition"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                <p className="text-gray-500 font-medium mb-6">Patient ID: #PAT-{user.id}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 p-3 rounded-2xl">
                                        <p className="text-[10px] uppercase font-extrabold text-indigo-400 tracking-widest mb-1">Blood Type</p>
                                        <p className="font-bold text-indigo-700">{user.bloodType || 'N/A'}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-2xl">
                                        <p className="text-[10px] uppercase font-extrabold text-green-400 tracking-widest mb-1">Gender</p>
                                        <p className="font-bold text-green-700">{user.gender || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Security Card */}
                            <div className="mt-6 bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaLock className="text-gray-400" /> Security
                                </h3>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Form Box */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-4 text-gray-300" />
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition ${isEditing ? 'bg-white border-indigo-100 focus:border-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`}
                                                value={user.name}
                                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-4 text-gray-300" />
                                            <input
                                                type="email"
                                                disabled={true}
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-gray-50 border-transparent text-gray-500 cursor-not-allowed`}
                                                value={user.email}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-4 text-gray-300" />
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition ${isEditing ? 'bg-white border-indigo-100 focus:border-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`}
                                                value={user.phone}
                                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Date of Birth</label>
                                        <div className="relative">
                                            <FaBirthdayCake className="absolute left-4 top-4 text-gray-300" />
                                            <input
                                                type="date"
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition ${isEditing ? 'bg-white border-indigo-100 focus:border-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`}
                                                value={user.dob}
                                                onChange={(e) => setUser({ ...user, dob: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Primary Address</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-300" />
                                            <textarea
                                                disabled={!isEditing}
                                                rows="3"
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition ${isEditing ? 'bg-white border-indigo-100 focus:border-indigo-500' : 'bg-gray-50 border-transparent text-gray-600'}`}
                                                value={user.address}
                                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FaLock className="text-indigo-600" /> Change Password
                        </h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {passwordStatus === 'error' && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold animate-shake">
                                    {errorMessage}
                                </div>
                            )}
                            {passwordStatus === 'success' && (
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm font-bold flex items-center gap-2">
                                    <FaCheckCircle /> Password changed successfully!
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientProfile;
