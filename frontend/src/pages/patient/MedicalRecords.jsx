import React from 'react';
import { FaFilePrescription, FaNotesMedical, FaUserMd, FaCalendarCheck } from 'react-icons/fa';

const MedicalRecords = () => {
    // Mock Data
    const prescriptions = [
        {
            id: 1,
            medication: 'Amoxicillin 500mg',
            dosage: '1 tablet 3 times daily',
            prescribedBy: 'Dr. Alice Smith',
            date: '2025-01-15',
            duration: '7 days',
            status: 'Active'
        },
        {
            id: 2,
            medication: 'Ibuprofen 400mg',
            dosage: 'As needed for pain',
            prescribedBy: 'Dr. John Doe',
            date: '2024-12-10',
            duration: '5 days',
            status: 'Completed'
        }
    ];

    const visits = [
        {
            id: 1,
            doctor: 'Dr. Alice Smith',
            specialty: 'Cardiology',
            date: '2025-01-15',
            diagnosis: 'Mild Hypertension',
            notes: 'Patient advised to reduce salt intake and exercise regularly.'
        },
        {
            id: 2,
            doctor: 'Dr. Bob Johnson',
            specialty: 'Dermatology',
            date: '2024-11-20',
            diagnosis: 'Eczema',
            notes: 'Prescribed topical cream. Follow up in 2 weeks.'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                <p className="text-gray-600">View your medical history, prescriptions, and visit details.</p>
            </div>

            {/* Prescriptions Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FaFilePrescription className="text-xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Prescription History</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prescriptions.map((script) => (
                        <div key={script.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{script.medication}</h3>
                                    <p className="text-sm text-gray-500">{script.dosage}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${script.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {script.status}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaUserMd className="text-gray-400" />
                                    <span>{script.prescribedBy}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendarCheck className="text-gray-400" />
                                    <span>{script.date} • {script.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Visit History Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <FaNotesMedical className="text-xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Visit History</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Doctor</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Diagnosis</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {visits.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                                            {visit.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{visit.doctor}</div>
                                            <div className="text-xs text-blue-600">{visit.specialty}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {visit.diagnosis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {visit.notes}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {visits.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No visit history found.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MedicalRecords;
