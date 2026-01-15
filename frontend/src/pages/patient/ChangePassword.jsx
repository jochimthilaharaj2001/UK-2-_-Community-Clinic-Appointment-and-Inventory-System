import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (passwords.new !== passwords.confirm) {
            toast.error("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        // Simulate API call
        toast.success("Password changed successfully!");
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl mt-16 border-t-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                <FaLock className="mr-3 text-blue-600" />
                Change Password
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                    <FaCheckCircle className="mr-2" />
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
