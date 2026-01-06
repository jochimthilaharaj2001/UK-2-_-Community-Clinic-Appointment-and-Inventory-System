import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaEye } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'patient', status: 'active', phone: '+1234567890', joinDate: '2023-01-15' },
    { id: 2, name: 'Dr. Sarah Wilson', email: 'sarah@hospital.com', role: 'doctor', status: 'active', phone: '+1234567891', joinDate: '2022-06-10' },
    { id: 3, name: 'Emily Johnson', email: 'emily@hospital.com', role: 'staff', status: 'active', phone: '+1234567892', joinDate: '2023-03-20' },
    { id: 4, name: 'Michael Brown', email: 'michael@example.com', role: 'patient', status: 'inactive', phone: '+1234567893', joinDate: '2022-11-05' },
    { id: 5, name: 'Dr. James Davis', email: 'james@hospital.com', role: 'doctor', status: 'active', phone: '+1234567894', joinDate: '2021-08-15' },
    { id: 6, name: 'Lisa Garcia', email: 'lisa@hospital.com', role: 'pharmacist', status: 'active', phone: '+1234567895', joinDate: '2023-05-12' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'pharmacist': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-gray-100 text-gray-800';
      case 'staff': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage patients, doctors, and staff members</p>
          </div>
          <button
            onClick={() => alert('Add user functionality coming soon!')}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="patient">Patient</option>
                <option value="staff">Staff</option>
              </select>

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

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                              {user.name.split(' ').map(n => n[0]).join('')}
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`Viewing ${user.name}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => alert(`Editing ${user.name}`)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              setUsers(users.filter(u => u.id !== user.id));
                              alert('User deleted successfully');
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
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
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;