import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaFileMedical, FaPrescriptionBottleAlt, FaDownload, FaEye } from 'react-icons/fa';
import api from '../../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';

const MedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            // In a real app:
            // const response = await api.get('/patient/medical-records');
            // setRecords(response.data);

            // Mocking for demonstration
            setTimeout(() => {
                setRecords([
                    {
                        id: 1,
                        doctor: 'Dr. Sarah Wilson',
                        date: '2025-12-15',
                        diagnosis: 'Seasonal Influenza',
                        treatment: 'Bed rest and fluids',
                        prescriptions: [
                            { medicine: 'Paracetamol', dosage: '500mg', frequency: 'Thrice a day', duration: '5 days' },
                            { medicine: 'Vitamin C', dosage: '1000mg', frequency: 'Once a day', duration: '10 days' }
                        ]
                    },
                    {
                        id: 2,
                        doctor: 'Dr. James Davis',
                        date: '2025-11-02',
                        diagnosis: 'Allergic Rhinitis',
                        treatment: 'Anti-histamines and avoiding dust',
                        prescriptions: [
                            { medicine: 'Cetirizine', dosage: '10mg', frequency: 'At night', duration: '7 days' }
                        ]
                    }
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Failed to fetch records');
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        console.log("Download requested for record:", selectedRecord);
        if (!selectedRecord) {
            toast.error("Please select a record first");
            return;
        }

        try {
            const loadingToast = toast.loading("Preparing your medical record...");

            // Initialize jsPDF
            const doc = new jsPDF();
            const user = JSON.parse(localStorage.getItem('user')) || { name: 'Patient' };

            // Set Title
            doc.setFontSize(22);
            doc.setTextColor(33, 150, 243);
            doc.text('COMMUNITY CLINIC', 105, 20, { align: 'center' });

            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.text('OFFICIAL MEDICAL RECORD', 105, 30, { align: 'center' });

            doc.setDrawColor(200);
            doc.line(20, 35, 190, 35);

            // Information Section
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text(`Patient Name: ${user.name}`, 20, 45);
            doc.text(`Record ID: REC-${selectedRecord.id}-${Date.now().toString().slice(-6)}`, 130, 45);
            doc.text(`Visit Date: ${selectedRecord.date}`, 20, 52);
            doc.text(`Doctor: ${selectedRecord.doctor}`, 130, 52);

            // Clinical Summary
            doc.setFontSize(14);
            doc.setTextColor(33, 150, 243);
            doc.text('Diagnosis', 20, 65);
            doc.setFontSize(11);
            doc.setTextColor(50);
            const diagnosisLines = doc.splitTextToSize(selectedRecord.diagnosis || "No diagnosis recorded", 170);
            doc.text(diagnosisLines, 20, 72);

            const treatmentY = 75 + (diagnosisLines.length * 5);
            doc.setFontSize(14);
            doc.setTextColor(33, 150, 243);
            doc.text('Treatment Plan', 20, treatmentY);
            doc.setFontSize(11);
            doc.setTextColor(50);
            const treatmentLines = doc.splitTextToSize(selectedRecord.treatment || "Follow standard care", 170);
            doc.text(treatmentLines, 20, treatmentY + 7);

            // Prescriptions Table
            const tableY = treatmentY + 15 + (treatmentLines.length * 5);
            doc.setFontSize(14);
            doc.setTextColor(33, 150, 243);
            doc.text('Prescriptions', 20, tableY);

            const tableData = (selectedRecord.prescriptions || []).map(p => [
                p.medicine,
                p.dosage,
                p.frequency,
                p.duration
            ]);

            autoTable(doc, {
                startY: tableY + 5,
                head: [['Medicine', 'Dosage', 'Frequency', 'Duration']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [33, 150, 243], fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 3 },
                margin: { left: 20, right: 20 }
            });

            // Calculate footer position based on table end
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 250;

            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.setFont('helvetica', 'italic');
            doc.text('This document is a digital copy of your consultation summary.', 105, finalY, { align: 'center' });
            doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, finalY + 7, { align: 'center' });

            // Final Save
            const safeFileName = `Medical_Record_${selectedRecord.date.replace(/\//g, '-')}.pdf`;
            doc.save(safeFileName);

            toast.dismiss(loadingToast);
            toast.success("Medical record downloaded successfully!");
            console.log("PDF successfully saved as:", safeFileName);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.dismiss();
            toast.error("Could not generate PDF. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 p-6 ml-64">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-600">Access your past consultation records and prescriptions.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* History List */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Visit History</h2>
                        {records.map(record => (
                            <div
                                key={record.id}
                                onClick={() => setSelectedRecord(record)}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedRecord?.id === record.id
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                                    : 'bg-white text-gray-900 border-gray-100 hover:border-blue-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-lg">{record.date}</p>
                                    <FaFileMedical className={selectedRecord?.id === record.id ? 'text-blue-100' : 'text-blue-500'} />
                                </div>
                                <p className={`text-sm ${selectedRecord?.id === record.id ? 'text-blue-50' : 'text-gray-500'}`}>
                                    Consulted with {record.doctor}
                                </p>
                                <p className={`mt-3 font-medium ${selectedRecord?.id === record.id ? 'text-white' : 'text-gray-800'}`}>
                                    {record.diagnosis}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Record Details */}
                    <div className="lg:col-span-2">
                        {selectedRecord ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-2xl font-bold">Consultation Summary</h2>
                                            <p className="opacity-80">Reference ID: #REC-{selectedRecord.id}0923</p>
                                        </div>
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition"
                                            title="Download as PDF"
                                        >
                                            <FaDownload />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8 text-gray-800">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Physician</p>
                                            <p className="font-bold text-lg">{selectedRecord.doctor}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Visit</p>
                                            <p className="font-bold text-lg">{selectedRecord.date}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Diagnosis</p>
                                        <div className="p-4 bg-blue-50 rounded-xl text-blue-900 font-medium">
                                            {selectedRecord.diagnosis}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Treatment Plan</p>
                                        <p className="text-gray-600 leading-relaxed">{selectedRecord.treatment}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaPrescriptionBottleAlt className="text-red-500" />
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prescriptions</p>
                                        </div>
                                        <div className="overflow-hidden border border-gray-100 rounded-2xl">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50 border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-xs font-bold text-gray-500">Medicine</th>
                                                        <th className="px-4 py-3 text-xs font-bold text-gray-500">Dosage</th>
                                                        <th className="px-4 py-3 text-xs font-bold text-gray-500">Frequency</th>
                                                        <th className="px-4 py-3 text-xs font-bold text-gray-500">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {selectedRecord.prescriptions.map((p, i) => (
                                                        <tr key={i}>
                                                            <td className="px-4 py-3 font-bold text-sm">{p.medicine}</td>
                                                            <td className="px-4 py-3 text-sm">{p.dosage}</td>
                                                            <td className="px-4 py-3 text-sm">{p.frequency}</td>
                                                            <td className="px-4 py-3 text-sm">{p.duration}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 h-96 flex flex-col items-center justify-center text-gray-400">
                                <FaEye size={48} className="mb-4 opacity-50" />
                                <p className="font-medium text-lg">Select a record to view details</p>
                                <p className="text-sm">Your full medical history is protected and private.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;
