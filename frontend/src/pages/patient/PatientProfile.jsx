import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaUser, FaPhone, FaMapMarkerAlt, FaLock, FaCamera, FaEnvelope, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const PatientProfile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/patient/profile');
            const userData = response.data;
            setUser(userData);
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phone: userData.phone || '',
                address: userData.address || '',
                email: userData.email || '',
                gender: userData.gender || '',
                dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''
            });
            // Update local storage too to keep it consistent
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching profile:', error);
            // toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth
            };

            await api.put('/patient/profile', updateData);

            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        try {
            await api.post('/patient/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedUser = { ...user, profilePhoto: reader.result };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                toast.success('Profile photo updated');
            };
            reader.readAsDataURL(file);
        }
    };

    const getDisplayName = () => {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user.name || 'Patient';
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 p-6 ml-64">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600">Manage your personal information and security settings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-center p-8">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white shadow-xl overflow-hidden">
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        getDisplayName().charAt(0)
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="photoInput"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                                <button
                                    onClick={() => document.getElementById('photoInput').click()}
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-4 border-white hover:bg-blue-700 transition"
                                >
                                    <FaCamera size={16} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{getDisplayName()}</h2>
                            <p className="text-blue-600 font-medium mb-4">Patient Profile</p>

                            <div className="space-y-4 text-left mt-8 border-t border-gray-50 pt-8">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FaEnvelope size={14} />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FaPhone size={14} />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Phone</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FaBirthdayCake size={14} />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Birth Date</p>
                                        <p className="font-medium">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <FaVenusMars size={14} />
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Gender</p>
                                        <p className="font-medium">{user.gender || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Edit Personal Info */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FaUser className="text-blue-500" /> Personal Details
                                </h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+94 77 123 4567"
                                    />
                                    {isEditing && (
                                        <p className="mt-1 text-[10px] text-gray-500">
                                            Format: +94 77 123 4567 or 07X XXX XXXX
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                                    <select
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                                    <textarea
                                        rows="3"
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    ></textarea>
                                </div>
                                {isEditing && (
                                    <div className="md:col-span-2 pt-4">
                                        <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <FaLock className="text-red-500" /> Security Settings
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
