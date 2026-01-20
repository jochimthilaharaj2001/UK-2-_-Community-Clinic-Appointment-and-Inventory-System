import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaUserPlus, 
  FaEye, 
  FaFilter,
  FaTimes,
  FaSave,
  FaKey,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCalendar,
  FaUserMd,
  FaPills,
  FaUserShield,
  FaUserNurse
} from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john@example.com', 
      role: 'patient', 
      status: 'active', 
      phone: '+1234567890', 
      joinDate: '2023-01-15',
      address: '123 Main St, City',
      lastLogin: '2024-01-15 09:30',
      department: 'N/A',
      specialization: 'N/A'
    },
    { 
      id: 2, 
      name: 'Dr. Sarah Wilson', 
      email: 'sarah@hospital.com', 
      role: 'doctor', 
      status: 'active', 
      phone: '+1234567891', 
      joinDate: '2022-06-10',
      address: '456 Oak Ave, City',
      lastLogin: '2024-01-15 08:45',
      department: 'Cardiology',
      specialization: 'Heart Specialist'
    },
    { 
      id: 3, 
      name: 'Emily Johnson', 
      email: 'emily@hospital.com', 
      role: 'staff', 
      status: 'active', 
      phone: '+1234567892', 
      joinDate: '2023-03-20',
      address: '789 Pine Rd, City',
      lastLogin: '2024-01-14 16:20',
      department: 'Administration',
      specialization: 'N/A'
    },
    { 
      id: 4, 
      name: 'Michael Brown', 
      email: 'michael@example.com', 
      role: 'patient', 
      status: 'inactive', 
      phone: '+1234567893', 
      joinDate: '2022-11-05',
      address: '321 Elm St, City',
      lastLogin: '2023-12-20 11:15',
      department: 'N/A',
      specialization: 'N/A'
    },
    { 
      id: 5, 
      name: 'Dr. James Davis', 
      email: 'james@hospital.com', 
      role: 'doctor', 
      status: 'active', 
      phone: '+1234567894', 
      joinDate: '2021-08-15',
      address: '654 Birch Ln, City',
      lastLogin: '2024-01-15 10:00',
      department: 'Pediatrics',
      specialization: 'Child Specialist'
    },
    { 
      id: 6, 
      name: 'Lisa Garcia', 
      email: 'lisa@hospital.com', 
      role: 'pharmacist', 
      status: 'active', 
      phone: '+1234567895', 
      joinDate: '2023-05-12',
      address: '987 Cedar Blvd, City',
      lastLogin: '2024-01-15 07:30',
      department: 'Pharmacy',
      specialization: 'Medication Management'
    },
    { 
      id: 7, 
      name: 'Admin User', 
      email: 'admin@clinic.com', 
      role: 'admin', 
      status: 'active', 
      phone: '+1234567896', 
      joinDate: '2021-01-01',
      address: 'Admin Building, Clinic',
      lastLogin: '2024-01-15 06:00',
      department: 'Administration',
      specialization: 'System Admin'
    },
    { 
      id: 8, 
      name: 'Nurse Jennifer', 
      email: 'jennifer@hospital.com', 
      role: 'staff', 
      status: 'active', 
      phone: '+1234567897', 
      joinDate: '2023-08-22',
      address: '555 Maple Dr, City',
      lastLogin: '2024-01-14 14:45',
      department: 'Nursing',
      specialization: 'Senior Nurse'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'patient',
    department: '',
    specialization: '',
    address: ''
  });

  const roles = [
    { value: 'admin', label: 'Admin', icon: <FaUserShield />, color: 'bg-purple-100 text-purple-800' },
    { value: 'doctor', label: 'Doctor', icon: <FaUserMd />, color: 'bg-blue-100 text-blue-800' },
    { value: 'pharmacist', label: 'Pharmacist', icon: <FaPills />, color: 'bg-green-100 text-green-800' },
    { value: 'staff', label: 'Staff', icon: <FaUserNurse />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'patient', label: 'Patient', icon: <FaUser />, color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        department: editingUser.department || '',
        specialization: editingUser.specialization || '',
        address: editingUser.address || ''
      });
      setShowForm(true);
    }
  }, [editingUser]);

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm) ||
                           user.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'joinDate') {
        return sortOrder === 'asc' 
          ? new Date(a.joinDate) - new Date(b.joinDate)
          : new Date(b.joinDate) - new Date(a.joinDate);
      }
      if (sortBy === 'lastLogin') {
        return sortOrder === 'asc'
          ? new Date(a.lastLogin) - new Date(b.lastLogin)
          : new Date(b.lastLogin) - new Date(a.lastLogin);
      }
      return 0;
    });

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getRoleIcon = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.icon : <FaUser />;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      const updatedUser = {
        ...editingUser,
        ...formData,
        lastLogin: new Date().toISOString().split('T')[0] + ' ' + 
                  new Date().toTimeString().split(' ')[0]
      };
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      alert('User updated successfully!');
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().split('T')[0] + ' ' + 
                  new Date().toTimeString().split(' ')[0]
      };
      
      setUsers([...users, newUser]);
      alert('User added successfully!');
    }
    
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'patient',
      department: '',
      specialization: '',
      address: ''
    });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleResetPassword = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user && window.confirm(`Reset password for ${user.name}?`)) {
      alert(`Password reset link sent to ${user.email}`);
    }
  };

  const getRoleStats = () => {
    const stats = {};
    roles.forEach(role => {
      stats[role.value] = users.filter(u => u.role === role.value).length;
    });
    return stats;
  };

  const roleStats = getRoleStats();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage patients, doctors, staff, and administrators</p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'patient',
                department: '',
                specialization: '',
                address: ''
              });
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Add New User
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {roles.map((role) => (
            <div key={role.value} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${role.color.replace('text-', 'text-opacity-100 text-').split(' ')[0]}`}>
                  {role.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{roleStats[role.value]}</div>
                  <div className="text-sm text-gray-600">{role.label}s</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, phone, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}s
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit User Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.role === 'doctor' || formData.role === 'pharmacist' || formData.role === 'staff' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter department"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter specialization"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter address"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
                  >
                    <FaSave className="mr-2" />
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Details View Modal */}
        {viewingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl text-blue-600 font-medium">
                      {viewingUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{viewingUser.name}</h2>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${getRoleColor(viewingUser.role)}`}>
                      {viewingUser.role.charAt(0).toUpperCase() + viewingUser.role.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{viewingUser.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{viewingUser.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="font-medium">{viewingUser.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaCalendar className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Join Date</div>
                        <div className="font-medium">{viewingUser.joinDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Last Login</div>
                        <div className="font-medium">{viewingUser.lastLogin}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${viewingUser.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium">
                          {viewingUser.status.charAt(0).toUpperCase() + viewingUser.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {(viewingUser.department || viewingUser.specialization) && (
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-gray-900 mb-3">Professional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {viewingUser.department !== 'N/A' && (
                        <div>
                          <div className="text-sm text-gray-500">Department</div>
                          <div className="font-medium">{viewingUser.department}</div>
                        </div>
                      )}
                      {viewingUser.specialization !== 'N/A' && (
                        <div>
                          <div className="text-sm text-gray-500">Specialization</div>
                          <div className="font-medium">{viewingUser.specialization}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditingUser(viewingUser);
                    setViewingUser(null);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                >
                  Edit User
                </button>
                <button
                  onClick={() => handleResetPassword(viewingUser.id)}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center"
                >
                  <FaKey className="mr-2" />
                  Reset Password
                </button>
                <button
                  onClick={() => setViewingUser(null)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      User
                      {sortBy === 'name' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center">
                      Join Date
                      {sortBy === 'joinDate' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {getRoleIcon(user.role)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                      <div className="text-sm text-gray-500">{user.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                        <button
                          onClick={() => handleStatusToggle(user.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            user.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50"
                          title="Reset Password"
                        >
                          <FaKey />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{users.length}</span> users
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">User Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-bold">{users.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inactive Users</span>
                <span className="font-bold text-red-600">
                  {users.filter(u => u.status === 'inactive').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New This Month</span>
                <span className="font-bold text-blue-600">
                  {users.filter(u => {
                    const joinDate = new Date(u.joinDate);
                    const now = new Date();
                    return joinDate.getMonth() === now.getMonth() && 
                           joinDate.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ ...formData, role: 'doctor' });
                  setShowForm(true);
                }}
                className="p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-center"
              >
                <FaUserMd className="text-2xl mx-auto mb-2" />
                <div className="font-medium">Add Doctor</div>
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ ...formData, role: 'patient' });
                  setShowForm(true);
                }}
                className="p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition text-center"
              >
                <FaUser className="text-2xl mx-auto mb-2" />
                <div className="font-medium">Add Patient</div>
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ ...formData, role: 'pharmacist' });
                  setShowForm(true);
                }}
                className="p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition text-center"
              >
                <FaPills className="text-2xl mx-auto mb-2" />
                <div className="font-medium">Add Pharmacist</div>
              </button>
              <button
                onClick={() => alert('Bulk import functionality coming soon!')}
                className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition text-center"
              >
                <FaUserPlus className="text-2xl mx-auto mb-2" />
                <div className="font-medium">Bulk Import</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;