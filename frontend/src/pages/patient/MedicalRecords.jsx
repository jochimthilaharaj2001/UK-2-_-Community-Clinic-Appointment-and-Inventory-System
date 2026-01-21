import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { jsPDF } from 'jspdf';
import {
    FaFilePrescription,
    FaCalendarAlt,
    FaUserMd,
    FaDownload,
    FaSearch,
    FaFilter,
    FaHeartbeat
} from 'react-icons/fa';

const MedicalRecords = () => {
    const [activeTab, setActiveTab] = useState('prescriptions');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [downloading, setDownloading] = useState(false);

    const prescriptions = [
        { id: 1, doctor: 'Dr. Jane Smith', date: '2026-01-15', meds: 'Amoxicillin, Paracetamol', diagnostic: 'Post-viral cough', status: 'Active' },
        { id: 2, doctor: 'Dr. John Miller', date: '2025-12-10', meds: 'Cetirizine', diagnostic: 'Allergic Rhinitis', status: 'Completed' },
        { id: 3, doctor: 'Dr. Sarah Wilson', date: '2025-11-05', meds: 'Hydrocortisone Cream', diagnostic: 'Dermatitis', status: 'Completed' }
    ];

    const medicalReports = [
        { id: 1, title: 'Blood Test Report', date: '2026-01-02', clinic: 'Community Clinic Lab', type: 'Laboratory' },
        { id: 2, title: 'X-Ray Thorax', date: '2025-11-20', clinic: 'Community Imaging Center', type: 'Radiology' }
    ];

    const filteredPrescriptions = prescriptions.filter(p =>
        (p.meds.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.diagnostic.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filter === 'All' || p.status === filter)
    );

    const filteredReports = medicalReports.filter(r =>
        (r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.clinic.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filter === 'All' || r.type === filter)
    );

    const handleDownload = (name, content) => {
        setDownloading(true);
        try {
            const doc = new jsPDF();

            // Add Title
            doc.setFontSize(22);
            doc.setTextColor(79, 70, 229); // Indigo 600
            doc.text("COMMUNITY CLINIC", 105, 20, { align: "center" });

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Medical Document", 105, 30, { align: "center" });

            doc.setDrawColor(200, 200, 200);
            doc.line(20, 35, 190, 35);

            // Add Body Content
            doc.setFontSize(12);
            const splitText = doc.splitTextToSize(content, 170);
            doc.text(splitText, 20, 50);

            // Add Footer
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 280, { align: "center" });

            doc.save(name.endsWith('.pdf') ? name : `${name}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setTimeout(() => setDownloading(false), 500);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
                            <p className="text-gray-600">Access your health history, prescriptions, and reports.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-sm px-3">
                                <FaFilter className="text-gray-400 text-sm" />
                                <select
                                    className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer py-2 outline-none"
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                    }}
                                >
                                    <option value="All">All {activeTab === 'prescriptions' ? 'Status' : 'Types'}</option>
                                    {activeTab === 'prescriptions' ? (
                                        <>
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Laboratory">Laboratory</option>
                                            <option value="Radiology">Radiology</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 p-1 bg-gray-200/50 rounded-xl w-fit">
                        <button
                            onClick={() => { setActiveTab('prescriptions'); setFilter('All'); }}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition ${activeTab === 'prescriptions' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Prescriptions
                        </button>
                        <button
                            onClick={() => { setActiveTab('reports'); setFilter('All'); }}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition ${activeTab === 'reports' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Reports & Results
                        </button>
                    </div>

                    {activeTab === 'prescriptions' && (
                        <div className="space-y-4">
                            {filteredPrescriptions.length > 0 ? (
                                filteredPrescriptions.map((p) => (
                                    <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-indigo-200 transition group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                    <FaFilePrescription />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-gray-800">{p.meds}</h3>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {p.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1"><FaUserMd className="text-gray-400" /> {p.doctor}</span>
                                                        <span className="flex items-center gap-1"><FaCalendarAlt className="text-gray-400" /> {p.date}</span>
                                                    </div>
                                                    <p className="mt-3 text-gray-600 text-sm">
                                                        <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest block mb-1">Diagnostic</span>
                                                        {p.diagnostic}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                disabled={downloading}
                                                onClick={() => handleDownload(`Prescription-${p.id}.pdf`, `Prescription ID: ${p.id}\nDoctor: ${p.doctor}\nDate: ${p.date}\nMedicines: ${p.meds}\nDiagnostic: ${p.diagnostic}\nStatus: ${p.status}`)}
                                                className="flex items-center gap-2 px-4 py-2 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm hover:shadow-indigo-100 disabled:opacity-50"
                                            >
                                                {downloading ? '...' : <FaDownload />} PDF
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-400 font-medium">No prescriptions found.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <div key={report.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                                <FaHeartbeat />
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                {report.type}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{report.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{report.clinic}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                <FaCalendarAlt size={10} /> {report.date}
                                            </span>
                                            <button
                                                disabled={downloading}
                                                onClick={() => handleDownload(`${report.title}.pdf`, `MEDICAL REPORT\nTitle: ${report.title}\nDate: ${report.date}\nClinic: ${report.clinic}\nType: ${report.type}\nStatus: Verified Result`)}
                                                className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline disabled:opacity-50"
                                            >
                                                {downloading ? 'Preparing...' : <>View Report <FaDownload size={12} /></>}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-400 font-medium">No reports found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;
