import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const data = JSON.parse(text);

        await api.post('/users/bulk', { users: data });
        alert('Bulk upload successful!');
        fetchUsers();
      } catch (err) {
        alert('Failed to process file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

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
    { value: 'receptionist', label: 'Receptionist', icon: <FaUserNurse />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'patient', label: 'Patient', icon: <FaUser />, color: 'bg-gray-100 text-gray-800' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleIcon = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.icon : <FaUser />;
  };

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'joinDate') {
        return sortOrder === 'asc'
          ? new Date(a.joinDate) - new Date(b.joinDate)
          : new Date(b.joinDate) - new Date(a.joinDate);
      }
      return 0;
    });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone || '',
        role: editingUser.role,
        department: editingUser.department || '',
        specialization: editingUser.specialization || '',
        address: editingUser.address || ''
      });
      setShowForm(true);
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
        alert('User updated successfully!');
      } else {
        await api.post('/users', formData);
        alert('User added successfully!');
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        name: '', email: '', phone: '', role: 'patient',
        department: '', specialization: '', address: ''
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.put(`/users/${userId}/status`, { status: newStatus });
      alert(`User status changed to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleResetPassword = (userId) => {
    alert("Reset password to be implemented via backend.");
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
                name: '', email: '', phone: '', role: 'patient',
                department: '', specialization: '', address: ''
              });
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center shadow-lg"
          >
            <FaUserPlus className="mr-2" />
            Add New User
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {roles.map((role) => (
            <div key={role.value} className="bg-white rounded-xl shadow p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${role.color}`}>
                  {role.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{roleStats[role.value] || 0}</div>
                  <div className="text-sm text-gray-600">{role.label}s</div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
                    <option key={role.value} value={role.value}>{role.label}s</option>
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

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="user@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+1234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  {formData.role === 'doctor' || formData.role === 'pharmacist' || formData.role === 'receptionist' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter department" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                        <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter specialization" />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter address" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center">
                    <FaSave className="mr-2" />
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingUser(null); }} className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-2xl">
                    {viewingUser.name ? viewingUser.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{viewingUser.name}</h2>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${getRoleColor(viewingUser.role)}`}>
                      {viewingUser.role ? (viewingUser.role.charAt(0).toUpperCase() + viewingUser.role.slice(1)) : 'Patient'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setViewingUser(null)} className="text-gray-400 hover:text-gray-600"><FaTimes className="text-xl" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center"><FaEnvelope className="text-gray-400 mr-3" /> <div><div className="text-sm text-gray-500">Email</div><div className="font-medium">{viewingUser.email}</div></div></div>
                    <div className="flex items-center"><FaPhone className="text-gray-400 mr-3" /> <div><div className="text-sm text-gray-500">Phone</div><div className="font-medium">{viewingUser.phone}</div></div></div>
                    <div className="flex items-center"><FaUser className="text-gray-400 mr-3" /> <div><div className="text-sm text-gray-500">Address</div><div className="font-medium">{viewingUser.address || 'N/A'}</div></div></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Professional Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center"><FaUserMd className="text-gray-400 mr-3" /> <div><div className="text-sm text-gray-500">Department</div><div className="font-medium">{viewingUser.department || 'N/A'}</div></div></div>
                    <div className="flex items-center"><FaPills className="text-gray-400 mr-3" /> <div><div className="text-sm text-gray-500">Specialization</div><div className="font-medium">{viewingUser.specialization || 'N/A'}</div></div></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => { setEditingUser(viewingUser); setViewingUser(null); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Edit User</button>
                <button onClick={() => setViewingUser(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-400 text-gray-800 font-medium rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>User {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 font-bold text-blue-600">{getRoleIcon(user.role)}</div>
                        <div><div className="text-sm font-medium text-gray-900">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{user.phone}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>{user.role}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status || 'active'}</span>
                        <button onClick={() => handleStatusToggle(user.id, user.status)} className={`text-xs px-2 py-1 rounded ${user.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => setViewingUser(user)} className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-lg hover:bg-blue-50" title="View"><FaEye /></button>
                        <button onClick={() => setEditingUser(user)} className="text-green-600 hover:text-green-900 px-2 py-1 rounded-lg hover:bg-green-50" title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 px-2 py-1 rounded-lg hover:bg-red-50" title="Delete"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => fileInputRef.current.click()} className="p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition text-center shadow-sm">
                <FaUserPlus className="text-2xl mx-auto mb-2" />
                <div className="font-medium">Bulk Import</div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />
              </button>
              <button onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); }} className="p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition text-center shadow-sm">
                <FaFilter className="text-2xl mx-auto mb-2" />
                <div className="font-medium">Reset Filters</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;