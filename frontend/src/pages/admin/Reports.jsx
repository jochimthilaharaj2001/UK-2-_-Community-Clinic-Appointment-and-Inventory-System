import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaDownload, FaFilter, FaChartBar, FaUsers, FaUserMd, FaCalendarAlt, FaMoneyBillWave, FaPills } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('monthly');

  const financialData = [
    { month: 'Jan', revenue: 125430, expenses: 85430, profit: 40000 },
    { month: 'Feb', revenue: 132560, expenses: 92340, profit: 40220 },
    { month: 'Mar', revenue: 148920, expenses: 101230, profit: 47690 },
    { month: 'Apr', revenue: 156780, expenses: 112340, profit: 44440 },
    { month: 'May', revenue: 142310, expenses: 98760, profit: 43550 },
    { month: 'Jun', revenue: 165430, expenses: 115670, profit: 49760 },
  ];

  const patientData = [
    { month: 'Jan', new: 245, returning: 432, total: 677 },
    { month: 'Feb', new: 278, returning: 456, total: 734 },
    { month: 'Mar', new: 312, returning: 489, total: 801 },
    { month: 'Apr', new: 289, returning: 512, total: 801 },
    { month: 'May', new: 301, returning: 534, total: 835 },
    { month: 'Jun', new: 324, returning: 567, total: 891 },
  ];

  const appointmentData = [
    { name: 'Consultation', value: 45 },
    { name: 'Follow-up', value: 30 },
    { name: 'Emergency', value: 15 },
    { name: 'Regular Checkup', value: 10 },
  ];

  const departmentRevenue = [
    { department: 'Cardiology', revenue: 45600, patients: 234 },
    { department: 'Pediatrics', revenue: 38900, patients: 189 },
    { department: 'Orthopedics', revenue: 52300, patients: 156 },
    { department: 'Dermatology', revenue: 28700, patients: 123 },
    { department: 'Neurology', revenue: 41500, patients: 98 },
  ];

  const inventoryValue = [
    { category: 'Medicines', value: 125600, items: 45 },
    { category: 'Supplies', value: 45600, items: 23 },
    { category: 'Equipment', value: 198700, items: 12 },
    { category: 'Vaccines', value: 78900, items: 8 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const summaryStats = [
    { title: 'Total Revenue', value: '$895,430', change: '+15%', icon: <FaMoneyBillWave className="text-2xl text-green-600" />, color: 'bg-green-50' },
    { title: 'Total Patients', value: '4,847', change: '+12%', icon: <FaUsers className="text-2xl text-blue-600" />, color: 'bg-blue-50' },
    { title: 'Total Appointments', value: '1,234', change: '+8%', icon: <FaCalendarAlt className="text-2xl text-purple-600" />, color: 'bg-purple-50' },
    { title: 'Active Doctors', value: '42', change: '+3', icon: <FaUserMd className="text-2xl text-red-600" />, color: 'bg-red-50' },
    { title: 'Inventory Value', value: '$448,800', change: '+5%', icon: <FaPills className="text-2xl text-yellow-600" />, color: 'bg-yellow-50' },
  ];

  const handleDownloadReport = () => {
    alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report for ${dateRange} period downloaded.`);
  };

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Financial Performance</h3>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
              <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
              <Bar dataKey="profit" fill="#00C49F" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="department" />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884D8" name="Revenue ($)" />
                <Bar dataKey="patients" fill="#82ca9d" name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Inventory Value Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryValue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.category}: $${(entry.value / 1000).toFixed(0)}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="category"
                >
                  {inventoryValue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Growth</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#0088FE" name="New Patients" />
              <Bar dataKey="returning" fill="#00C49F" name="Returning Patients" />
              <Bar dataKey="total" fill="#FF8042" name="Total Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Types Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Demographics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Age Group 0-18</span>
              <span className="font-bold text-blue-600">18%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Age Group 19-35</span>
              <span className="font-bold text-green-600">32%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Age Group 36-55</span>
              <span className="font-bold text-yellow-600">28%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Age Group 56+</span>
              <span className="font-bold text-red-600">22%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperationalReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Operational Efficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">Appointment Utilization</h4>
            <p className="text-3xl font-bold text-blue-700">92%</p>
            <p className="text-sm text-blue-600">Average doctor schedule utilization</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">Patient Wait Time</h4>
            <p className="text-3xl font-bold text-green-700">18 min</p>
            <p className="text-sm text-green-600">Average waiting time</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2">Bed Occupancy</h4>
            <p className="text-3xl font-bold text-purple-700">78%</p>
            <p className="text-sm text-purple-600">Current bed occupancy rate</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-bold text-yellow-900 mb-2">Staff Productivity</h4>
            <p className="text-3xl font-bold text-yellow-700">88%</p>
            <p className="text-sm text-yellow-600">Average staff productivity score</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Performance Indicators</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Patient Satisfaction</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.7/5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.8/5</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    On Track
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">↑ 0.2</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Readmission Rate</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Attention
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">↑ 0.3%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No-show Rate</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8.5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Attention
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">↑ 0.5%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Medication Error</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.1%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Good
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">↓ 0.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive clinic performance insights</p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center"
          >
            <FaDownload className="mr-2" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {summaryStats.map((stat, index) => (
            <div key={index} className={`${stat.color} border rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setReportType('financial')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                reportType === 'financial'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaMoneyBillWave />
              Financial Reports
            </button>
            <button
              onClick={() => setReportType('patient')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                reportType === 'patient'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaUsers />
              Patient Reports
            </button>
            <button
              onClick={() => setReportType('operational')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                reportType === 'operational'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaChartBar />
              Operational Reports
            </button>
            <button
              onClick={() => setReportType('inventory')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                reportType === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaPills />
              Inventory Reports
            </button>
          </div>
        </div>

        {reportType === 'financial' && renderFinancialReport()}
        {reportType === 'patient' && renderPatientReport()}
        {reportType === 'operational' && renderOperationalReport()}
        {reportType === 'inventory' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Inventory Reports</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Stock Turnover Rate</h4>
                  <p className="text-3xl font-bold text-blue-700">3.2x</p>
                  <p className="text-sm text-blue-600">Average annual inventory turnover</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold text-green-900 mb-2">Stockout Rate</h4>
                  <p className="text-3xl font-bold text-green-700">2.5%</p>
                  <p className="text-sm text-green-600">Items out of stock</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Low Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiring Soon</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryValue.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.items}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            {Math.floor(Math.random() * 5) + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            {Math.floor(Math.random() * 3) + 1}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Report Generation Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-bold text-gray-900 mb-2">Daily Summary</h4>
              <p className="text-sm text-gray-600">Generate daily activity report</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-bold text-gray-900 mb-2">Monthly Performance</h4>
              <p className="text-sm text-gray-600">Comprehensive monthly metrics</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-bold text-gray-900 mb-2">Custom Report</h4>
              <p className="text-sm text-gray-600">Create custom report with filters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;