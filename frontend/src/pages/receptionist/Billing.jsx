// pages/receptionist/Billing.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileInvoiceDollar, 
  FaArrowLeft, 
  FaSearch, 
  FaPrint,
  FaDownload,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter
} from 'react-icons/fa';

const Billing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const invoices = [
    { 
      id: 'INV-00123', 
      patientName: 'John Smith', 
      date: '2024-01-18',
      amount: 250.00,
      paid: 150.00,
      balance: 100.00,
      status: 'partial',
      services: ['Consultation', 'Lab Test'],
      dueDate: '2024-01-25'
    },
    { 
      id: 'INV-00124', 
      patientName: 'Emily Johnson', 
      date: '2024-01-17',
      amount: 180.50,
      paid: 180.50,
      balance: 0.00,
      status: 'paid',
      services: ['Follow-up'],
      dueDate: '2024-01-24'
    },
    { 
      id: 'INV-00125', 
      patientName: 'Michael Brown', 
      date: '2024-01-16',
      amount: 450.75,
      paid: 0.00,
      balance: 450.75,
      status: 'overdue',
      services: ['Emergency Visit', 'X-Ray'],
      dueDate: '2024-01-15'
    },
    { 
      id: 'INV-00126', 
      patientName: 'Sarah Miller', 
      date: '2024-01-15',
      amount: 125.00,
      paid: 125.00,
      balance: 0.00,
      status: 'paid',
      services: ['Check-up'],
      dueDate: '2024-01-15'
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalBilling: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    totalPaid: invoices.reduce((sum, inv) => sum + inv.paid, 0),
    totalDue: invoices.reduce((sum, inv) => sum + inv.balance, 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.balance, 0)
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <FaCheckCircle className="text-green-500" />;
      case 'partial': return <FaMoneyBillWave className="text-yellow-500" />;
      case 'overdue': return <FaTimesCircle className="text-red-500" />;
      default: return null;
    }
  };

  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.balance.toString());
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    alert(`Payment of $${paymentAmount} processed for invoice ${selectedInvoice.id}`);
    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setPaymentAmount('');
  };

  const printInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Invoice ${invoice.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Clinic Invoice</h2>
          <hr>
          <p><strong>Invoice ID:</strong> ${invoice.id}</p>
          <p><strong>Patient:</strong> ${invoice.patientName}</p>
          <p><strong>Date:</strong> ${invoice.date}</p>
          <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
          <br>
          <h3>Services:</h3>
          <ul>
            ${invoice.services.map(service => `<li>• ${service}</li>`).join('')}
          </ul>
          <br>
          <h3>Payment Summary:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px;">Total Amount:</td>
              <td style="text-align: right; padding: 8px;">$${invoice.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Amount Paid:</td>
              <td style="text-align: right; padding: 8px;">$${invoice.paid.toFixed(2)}</td>
            </tr>
            <tr style="border-top: 2px solid #000;">
              <td style="padding: 8px;"><strong>Balance Due:</strong></td>
              <td style="text-align: right; padding: 8px;"><strong>$${invoice.balance.toFixed(2)}</strong></td>
            </tr>
          </table>
          <hr>
          <p style="margin-top: 30px;">Thank you for your payment!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/receptionist/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-2">Manage invoices and process payments</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
            <FaFileInvoiceDollar />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaFileInvoiceDollar className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalBilling.toFixed(2)}</p>
              <p className="text-gray-600">Total Billing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalPaid.toFixed(2)}</p>
              <p className="text-gray-600">Total Paid</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaMoneyBillWave className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalDue.toFixed(2)}</p>
              <p className="text-gray-600">Total Due</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimesCircle className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.overdue.toFixed(2)}</p>
              <p className="text-gray-600">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-1">
              Search
            </button>
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Invoice ID</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Patient</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Date</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Amount</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Paid</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Balance</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Status</th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{invoice.id}</div>
                    <div className="text-sm text-gray-500">Due: {invoice.dueDate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{invoice.patientName}</div>
                    <div className="text-sm text-gray-500">
                      {invoice.services.slice(0, 2).join(', ')}
                      {invoice.services.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600">{invoice.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">${invoice.amount.toFixed(2)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-green-600 font-medium">${invoice.paid.toFixed(2)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`font-bold ${
                      invoice.balance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${invoice.balance.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(invoice.status)}
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => printInvoice(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Print Invoice"
                      >
                        <FaPrint />
                      </button>
                      {invoice.balance > 0 && (
                        <button
                          onClick={() => handlePayment(invoice)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Process Payment"
                        >
                          <FaCreditCard />
                        </button>
                      )}
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="View Details">
                        <FaSearch />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="mt-8 text-center py-12">
          <FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">Try changing your search or filter criteria</p>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Payment</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedInvoice.patientName}</p>
                <p className="text-gray-600">Invoice: {selectedInvoice.id}</p>
                <div className="mt-2 flex justify-between">
                  <span>Balance Due:</span>
                  <span className="font-bold text-red-600">${selectedInvoice.balance.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="0"
                    max={selectedInvoice.balance}
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Maximum: ${selectedInvoice.balance.toFixed(2)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>Cash</option>
                  <option>Insurance</option>
                  <option>Check</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Optional payment notes..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={processPayment}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
              >
                Process Payment
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedInvoice(null);
                  setPaymentAmount('');
                }}
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">Generate Monthly Report</div>
            <p className="text-sm text-gray-600 mt-1">Create billing report for current month</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">Send Payment Reminders</div>
            <p className="text-sm text-gray-600 mt-1">Send reminders for overdue invoices</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="font-medium text-gray-900">Export Billing Data</div>
            <p className="text-sm text-gray-600 mt-1">Export invoices to CSV/Excel</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;