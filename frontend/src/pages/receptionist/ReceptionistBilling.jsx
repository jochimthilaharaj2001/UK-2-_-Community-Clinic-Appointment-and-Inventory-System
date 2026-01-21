import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaPrint, FaFileInvoiceDollar, FaMoneyBillWave, FaCreditCard, FaCalendarAlt, FaUser, FaDownload } from 'react-icons/fa';

const ReceptionistBilling = () => {
const [bills] = useState([
  { 
    id: 1, 
    invoiceNo: 'INV-2024-001',
    patientName: 'Raja',
    patientId: 'PAT001',
    date: '2024-01-18',
    services: ['Siddha Consultation', 'Herbal Medicine Dispensing'],
    totalAmount: 7500.00,
    paidAmount: 7500.00,
    balance: 0.00,
    paymentMethod: 'Credit Card',
    status: 'Paid'
  },
  { 
    id: 2, 
    invoiceNo: 'INV-2024-002',
    patientName: 'Sivakumar',
    patientId: 'PAT002',
    date: '2024-01-18',
    services: ['Siddha Consultation', 'Varmam Therapy'],
    totalAmount: 10500.00,
    paidAmount: 6000.00,
    balance: 4500.00,
    paymentMethod: 'Cash',
    status: 'Partial'
  },
  { 
    id: 3, 
    invoiceNo: 'INV-2024-003',
    patientName: 'Karthikeyan',
    patientId: 'PAT003',
    date: '2024-01-17',
    services: ['Siddha Consultation'],
    totalAmount: 4500.00,
    paidAmount: 0.00,
    balance: 4500.00,
    paymentMethod: 'Pending',
    status: 'Unpaid'
  },
  { 
    id: 4, 
    invoiceNo: 'INV-2024-004',
    patientName: 'Vijayalakshmi',
    patientId: 'PAT004',
    date: '2024-01-16',
    services: ['Siddha Consultation', 'External Oil Application'],
    totalAmount: 6500.00,
    paidAmount: 6500.00,
    balance: 0.00,
    paymentMethod: 'Insurance',
    status: 'Paid'
  },
]);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    referenceNo: '',
    notes: ''
  });

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch(method) {
      case 'Credit Card': return 'text-purple-600';
      case 'Cash': return 'text-green-600';
      case 'Insurance': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const calculateTotal = () => {
    const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const paid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const balance = bills.reduce((sum, bill) => sum + bill.balance, 0);
    
    return { total, paid, balance };
  };

  const totals = calculateTotal();

  const handlePrintInvoice = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${bill.invoiceNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            .details div { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; font-size: 18px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Clinic Invoice</h1>
            <h3>Invoice #${bill.invoiceNo}</h3>
          </div>
          
          <div class="details">
            <div><strong>Date:</strong> ${bill.date}</div>
            <div><strong>Patient:</strong> ${bill.patientName} (${bill.patientId})</div>
            <div><strong>Status:</strong> ${bill.status}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bill.services.map(service => `
                <tr>
                  <td>${service}</td>
                  <td>$100.00</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total Amount:</strong></td>
                <td><strong>$${bill.totalAmount.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td><strong>Paid Amount:</strong></td>
                <td><strong>$${bill.paidAmount.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td><strong>Balance Due:</strong></td>
                <td><strong>$${bill.balance.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="footer">
            <p>Thank you for choosing our clinic!</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleReceivePayment = (bill) => {
    setSelectedBill(bill);
    setPaymentData({
      amount: bill.balance.toString(),
      paymentMethod: 'cash',
      referenceNo: '',
      notes: ''
    });
    setShowPaymentForm(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600">Manage patient invoices and payments</p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center">
            <FaFileInvoiceDollar className="mr-2" />
            Generate Invoice
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">${totals.total.toFixed(2)}</h3>
            <p className="text-gray-600">Total Billing Amount</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FaCreditCard className="text-2xl" />
              </div>
              <span className="text-sm font-medium text-blue-600">+8%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">${totals.paid.toFixed(2)}</h3>
            <p className="text-gray-600">Total Received</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <FaFileInvoiceDollar className="text-2xl" />
              </div>
              <span className="text-sm font-medium text-red-600">-3%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">${totals.balance.toFixed(2)}</h3>
            <p className="text-gray-600">Pending Balance</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Filter by date"
              />
            </div>
            
            <div>
              <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center">
                <FaDownload className="mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Billing Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Invoice Details</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Patient</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Amount Details</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Payment Info</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-gray-900">{bill.invoiceNo}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {bill.date}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bill.services.map((service, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{bill.patientName}</p>
                        <p className="text-sm text-gray-500">{bill.patientId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total:</span>
                          <span className="font-medium">${bill.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Paid:</span>
                          <span className="font-medium text-green-600">${bill.paidAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Balance:</span>
                          <span className={`font-medium ${bill.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${bill.balance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">Method</p>
                          <p className={`font-medium ${getPaymentMethodColor(bill.paymentMethod)}`}>
                            {bill.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        {bill.balance > 0 && (
                          <button
                            onClick={() => handleReceivePayment(bill)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg"
                          >
                            Receive Payment
                          </button>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrintInvoice(bill)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Print Invoice"
                          >
                            <FaPrint />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="View Details">
                            <FaFileInvoiceDollar />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            ×
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Receive Payment</h2>
                  <p className="text-gray-600">Invoice: {selectedBill.invoiceNo}</p>
                </div>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{selectedBill.patientName}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">${selectedBill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">${selectedBill.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Balance Due:</span>
                  <span className="font-bold text-red-600">${selectedBill.balance.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter amount"
                    max={selectedBill.balance}
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum: ${selectedBill.balance.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.referenceNo}
                    onChange={(e) => setPaymentData({...paymentData, referenceNo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="TRX-123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Add any notes about this payment..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg">
                  Process Payment
                </button>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistBilling;