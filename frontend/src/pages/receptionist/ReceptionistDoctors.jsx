import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import {
    FaSearch,
    FaStethoscope,
    FaUserMd,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaBuilding,
    FaGraduationCap,
    FaClock
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ReceptionistDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await api.get('/receptionist/doctors');
            setDoctors(res.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctor list');
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const viewSchedule = (doctorName) => {
        navigate(`/receptionist/appointments-calendar?doctor=${encodeURIComponent(doctorName)}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-amber-500 pl-4">Doctor List</h1>
                        <p className="text-gray-600 mt-1 ml-5">View and manage clinical staff availability</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search doctors by name, specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                                            <FaUserMd size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg truncate">{doc.name}</h3>
                                            <p className="text-amber-600 font-medium text-sm">{doc.specialization || 'General Physician'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FaBuilding className="text-gray-400 shrink-0" />
                                            <span>{doc.department || 'General Practice'}</span>
                                        </div>
                                        {doc.experience && (
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <FaClock className="text-gray-400 shrink-0" />
                                                <span>{doc.experience} Experience</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FaEnvelope className="text-gray-400 shrink-0" />
                                            <span className="truncate">{doc.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FaPhone className="text-gray-400 shrink-0" />
                                            <span>{doc.phone || 'N/A'}</span>
                                        </div>
                                        {doc.education && (
                                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                                <FaGraduationCap className="text-gray-400 shrink-0" />
                                                <span className="truncate">{doc.education}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => viewSchedule(doc.name)}
                                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95"
                                        >
                                            <FaCalendarAlt /> View Schedule
                                        </button>
                                        <button
                                            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-all"
                                            title="Doctor Details"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredDoctors.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-3">
                                    <FaStethoscope size={48} className="text-gray-200" />
                                    <p className="font-medium text-lg text-gray-400">No doctors matched your search</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceptionistDoctors;
