
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserShield,
    FaUserMd,
    FaUserTie,
    FaUserInjured,
    FaClinicMedical,
    FaPills
} from 'react-icons/fa';

const PortalAccess = () => {
    const navigate = useNavigate();

    const portals = [
        {
            id: 'patient',
            title: 'Patient Portal',
            description: 'Book appointments, view medical records and prescriptions.',
            icon: <FaUserInjured className="text-4xl" />,
            color: 'bg-blue-600',
            hoverColor: 'hover:bg-blue-700',
            path: '/patient/login'
        },
        {
            id: 'doctor',
            title: 'Doctor Portal',
            description: 'Manage appointments, patient records, and prescriptions.',
            icon: <FaUserMd className="text-4xl" />,
            color: 'bg-green-600',
            hoverColor: 'hover:bg-green-700',
            path: '/login?role=doctor'
        },
        {
            id: 'receptionist',
            title: 'Reception Portal',
            description: 'Handle patient registration and appointment scheduling.',
            icon: <FaUserTie className="text-4xl" />,
            color: 'bg-teal-600',
            hoverColor: 'hover:bg-teal-700',
            path: '/login?role=receptionist'
        },
        {
            id: 'pharmacist',
            title: 'Pharmacy Portal',
            description: 'Manage medicine inventory and dispense prescriptions.',
            icon: <FaPills className="text-4xl" />,
            color: 'bg-green-700',
            hoverColor: 'hover:bg-green-800',
            path: '/pharmacist/login'
        },
        {
            id: 'admin',
            title: 'Admin Portal',
            description: 'Complete system management and reporting.',
            icon: <FaUserShield className="text-4xl" />,
            color: 'bg-gray-800',
            hoverColor: 'hover:bg-gray-900',
            path: '/login?role=admin'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-6xl w-full">
                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-white rounded-3xl shadow-xl mb-6 text-blue-600">
                        <FaClinicMedical className="text-6xl" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Community Clinic Management System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Welcome to our integrated healthcare platform. Please select your designated portal to continue.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {portals.map((portal) => (
                        <div
                            key={portal.id}
                            onClick={() => navigate(portal.path)}
                            className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className={`${portal.color} text-white p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                {portal.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{portal.title}</h2>
                            <p className="text-gray-500 mb-6 flex-grow">{portal.description}</p>
                            <div className={`w-full py-3 rounded-xl font-bold text-white transition-colors duration-300 ${portal.color} ${portal.hoverColor}`}>
                                Enter Portal
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center text-gray-400 text-sm">
                    &copy; 2026 Community Clinic Appointment & Inventory System. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default PortalAccess;
