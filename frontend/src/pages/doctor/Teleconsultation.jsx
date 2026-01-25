import Sidebar from '../../components/Sidebar';
import { FaVideo, FaMicrophone, FaDesktop, FaPhoneSlash } from 'react-icons/fa';

const Teleconsultation = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto h-full flex flex-col">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Teleconsultation</h1>
                            <p className="text-gray-400">Virtual meeting with patient</p>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-800 p-2 rounded-lg">
                            <div className="w-3 h-3 bg-red-500 animate-pulse rounded-full"></div>
                            <span className="text-sm font-medium">LIVE</span>
                        </div>
                    </header>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Video View */}
                        <div className="lg:col-span-2 relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 aspect-video flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaVideo className="text-4xl text-gray-600" />
                                </div>
                                <p className="text-xl font-medium text-gray-400">Waiting for patient to join...</p>
                            </div>

                            {/* Doctor Mini View */}
                            <div className="absolute right-4 bottom-4 w-48 h-32 bg-gray-800 rounded-xl border-2 border-blue-500 overflow-hidden shadow-lg">
                                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                    <FaVideo className="text-2xl text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Consultation Notes</h2>
                            <textarea
                                className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Start typing consultation notes here..."
                            ></textarea>
                            <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
                                Save and End Meeting
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="mt-8 flex justify-center items-center gap-6">
                        <button className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-2xl transition shadow-lg">
                            <FaMicrophone />
                        </button>
                        <button className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-2xl transition shadow-lg text-blue-400 border-2 border-blue-500">
                            <FaVideo />
                        </button>
                        <button className="w-14 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-2xl transition shadow-lg">
                            <FaDesktop />
                        </button>
                        <button className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-2xl transition shadow-lg animate-pulse">
                            <FaPhoneSlash />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Teleconsultation;
