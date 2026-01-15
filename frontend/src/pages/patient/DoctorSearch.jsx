import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserMd, FaFilter, FaStethoscope, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const DoctorSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');
    const [displayValidators, setDisplayValidators] = useState([]); // Filtered doctors

    // Mock Data - Expanded
    const allDoctors = [
        {
            id: 1,
            name: 'Dr. Alice Smith',
            specialty: 'Cardiology',
            experience: '15 years',
            rating: 4.8,
            location: 'Main Building, Floor 3',
            image: null
        },
        {
            id: 2,
            name: 'Dr. Bob Johnson',
            specialty: 'Dermatology',
            experience: '8 years',
            rating: 4.5,
            location: 'West Wing, Room 102',
            image: null
        },
        {
            id: 3,
            name: 'Dr. John Doe',
            specialty: 'Neurology',
            experience: '12 years',
            rating: 4.9,
            location: 'Main Building, Floor 4',
            image: null
        },
        {
            id: 4,
            name: 'Dr. Emma Davis',
            specialty: 'Pediatrics',
            experience: '5 years',
            rating: 4.7,
            location: 'Children\'s Center',
            image: null
        },
        {
            id: 5,
            name: 'Dr. James Wilson',
            specialty: 'Orthopedics',
            experience: '20 years',
            rating: 4.6,
            location: 'East Wing, Room 205',
            image: null
        },
        {
            id: 6,
            name: 'Dr. Sarah Parker',
            specialty: 'Cardiology',
            experience: '10 years',
            rating: 4.8,
            location: 'Main Building, Floor 3',
            image: null
        },
        {
            id: 7,
            name: 'Dr. Michael Brown',
            specialty: 'General Medicine',
            experience: '25 years',
            rating: 5.0,
            location: 'Main Building, Floor 1',
            image: null
        },
    ];

    const specialties = [
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Pediatrics',
        'Orthopedics',
        'General Medicine',
        'Gynecology',
        'Psychiatry'
    ];

    useEffect(() => {
        // Initial load show all or some
        filterDoctors();
    }, [searchQuery, specialtyFilter]);

    const filterDoctors = () => {
        let filtered = allDoctors;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(query) ||
                doc.specialty.toLowerCase().includes(query)
            );
        }

        if (specialtyFilter) {
            filtered = filtered.filter(doc => doc.specialty === specialtyFilter);
        }

        setDisplayValidators(filtered);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSpecialtyFilter('');
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Find Your Specialist</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Search and filter through our qualified doctors to find the right care for you.
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center">

                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, condition, or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    {/* Filter Options */}
                    <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="relative min-w-[200px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaStethoscope className="text-gray-400" />
                            </div>
                            <select
                                value={specialtyFilter}
                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none cursor-pointer"
                            >
                                <option value="">All Specialties</option>
                                {specialties.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>

                        {(searchQuery || specialtyFilter) && (
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors whitespace-nowrap"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Popular Tags / Options */}
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <span className="text-gray-500 flex items-center gap-2 mr-2">
                        <FaFilter className="text-xs" /> Quick Filters:
                    </span>
                    {['Cardiology', 'Pediatrics', 'Dermatology'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSpecialtyFilter(tag)}
                            className={`px-3 py-1 rounded-full border transition-colors ${specialtyFilter === tag
                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayValidators.length > 0 ? (
                    displayValidators.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                                        <FaUserMd className="text-2xl" />
                                    </div>
                                    <span className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg text-sm">
                                        <FaStar /> {doc.rating}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{doc.name}</h3>
                                <p className="text-blue-600 font-medium mb-3">{doc.specialty}</p>

                                <div className="space-y-2 text-sm text-gray-500 mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaStethoscope className="text-gray-400" />
                                        <span>{doc.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{doc.location}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/doctor/${doc.id}`}
                                    className="block w-full py-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 font-semibold rounded-xl text-center transition-all duration-300"
                                >
                                    View Profile & Book
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <FaSearch className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No doctors found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 text-blue-600 font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorSearch;
