import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaKey, FaSave } from 'react-icons/fa';

const Profile = () => {
    // Placeholder initial state
    const [profile, setProfile] = useState({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        address: '123 Main St, Cityville'
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Simulate API update
        toast.success("Changes saved successfully!");
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl mt-10">
            <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FaUserCircle className="mr-3 text-blue-600 text-4xl" />
                    My Profile
                </h2>
                <Link
                    to="/change-password"
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                >
                    <FaKey className="mr-2" />
                    Change Password
                </Link>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                        name="address"
                        rows="3"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                </div>

                <div className="col-span-1 md:col-span-2 mt-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaSave className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
