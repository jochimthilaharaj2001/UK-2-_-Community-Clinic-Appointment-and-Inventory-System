import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { FaSearch, FaPlus, FaPrint, FaFileInvoiceDollar, FaMoneyBillWave, FaCreditCard, FaCalendarAlt, FaUser, FaDownload } from 'react-icons/fa';

const ReceptionistBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    referenceNo: '',
    notes: ''
  });
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    patient_id: '',
    total_amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, [statusFilter]);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/receptionist/patients');
      setPatients(res.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/receptionist/invoices${statusFilter !== 'all' ? `?status=${statusFilter.toLowerCase()}` : ''}`);
      setBills(res.data.map(bill => ({
        id: bill.id,
        invoiceNo: `INV-${String(bill.id).padStart(5, '0')}`,
        patientName: bill.patient_name,
        patientId: `PAT${bill.patient_id}`,
        date: bill.invoice_date.split('T')[0],
        services: bill.notes?.split(',') || ['Consultation'],
        totalAmount: parseFloat(bill.total_amount),
        paidAmount: parseFloat(bill.paid_amount),
        balance: parseFloat(bill.total_amount) - parseFloat(bill.paid_amount),
        paymentMethod: bill.payment_method,
        status: bill.payment_status.charAt(0).toUpperCase() + bill.payment_status.slice(1)
      })));
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
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
                  <td>LKR 100.00</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total Amount:</strong></td>
                <td><strong>LKR ${bill.totalAmount.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td><strong>Paid Amount:</strong></td>
                <td><strong>LKR ${bill.paidAmount.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td><strong>Balance Due:</strong></td>
                <td><strong>LKR ${bill.balance.toFixed(2)}</strong></td>
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
      paymentMethod: bill.paymentMethod?.toLowerCase() || 'cash',
      referenceNo: '',
      notes: ''
    });
    setShowPaymentForm(true);
  };

  const processPayment = async () => {
    try {
      setLoading(true);
      const newPaidAmount = selectedBill.paidAmount + parseFloat(paymentData.amount);
      const newStatus = newPaidAmount >= selectedBill.totalAmount ? 'paid' : 'partial';

      await api.put(`/receptionist/invoices/${selectedBill.id}`, {
        paid_amount: newPaidAmount,
        payment_status: newStatus,
        payment_method: paymentData.paymentMethod
      });

      alert('Payment processed successfully!');
      setShowPaymentForm(false);
      fetchBills();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (filteredBills.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Invoice No', 'Patient', 'Date', 'Total Amount', 'Paid Amount', 'Balance', 'Status', 'Method'];
    const csvRows = [
      headers.join(','),
      ...filteredBills.map(bill => [
        `"${bill.invoiceNo}"`,
        `"${bill.patientName}"`,
        `"${bill.date}"`,
        bill.totalAmount,
        bill.paidAmount,
        bill.balance,
        `"${bill.status}"`,
        `"${bill.paymentMethod}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `billing_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const submitNewInvoice = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!newInvoice.patient_id || !newInvoice.total_amount) {
        alert('Please fill in required fields');
        return;
      }

      await api.post('/receptionist/invoices', {
        ...newInvoice,
        payment_status: 'pending',
        paid_amount: 0,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      });

      alert('Invoice generated successfully!');
      setShowInvoiceForm(false);
      setNewInvoice({ patient_id: '', total_amount: '', notes: '' });
      fetchBills();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowDetailsModal(true);
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/receptionist/invoices/${id}`);
        alert('Invoice deleted successfully');
        fetchBills();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
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
          <button
            onClick={() => setShowInvoiceForm(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center"
          >
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
              <span className="text-sm font-medium text-green-600">+942%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">LKR {totals.total.toFixed(2)}</h3>
            <p className="text-gray-600">Total Billing Amount</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FaCreditCard className="text-2xl" />
              </div>
              <span className="text-sm font-medium text-blue-600">+8%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">LKR {totals.paid.toFixed(2)}</h3>
            <p className="text-gray-600">Total Received</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <FaFileInvoiceDollar className="text-2xl" />
              </div>
              <span className="text-sm font-medium text-red-600">-3%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">LKR {totals.balance.toFixed(2)}</h3>
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
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center"
              >
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
                          <span className="font-medium">LKR {bill.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Paid:</span>
                          <span className="font-medium text-green-600">LKR {bill.paidAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Balance:</span>
                          <span className={`font-medium ${bill.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            LKR {bill.balance.toFixed(2)}
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
                          <button
                            onClick={() => handleViewDetails(bill)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="View Details"
                          >
                            <FaFileInvoiceDollar />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(bill.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-md w-full">
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
                  <span className="font-medium">LKR {selectedBill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">LKR {selectedBill.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Balance Due:</span>
                  <span className="font-bold text-red-600">LKR {selectedBill.balance.toFixed(2)}</span>
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
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter amount"
                    max={selectedBill.balance}
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum: LKR {selectedBill.balance.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
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
                    onChange={(e) => setPaymentData({ ...paymentData, referenceNo: e.target.value })}
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
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Add any notes about this payment..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={processPayment}
                  disabled={loading}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Process Payment'}
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
        {/* Generate Invoice Modal */}
        {showInvoiceForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-md w-full">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate New Invoice</h2>
                <button
                  onClick={() => setShowInvoiceForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={submitNewInvoice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={newInvoice.patient_id}
                    onChange={(e) => setNewInvoice({ ...newInvoice, patient_id: e.target.value })}
                    required
                  >
                    <option value="">Choose a patient</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">LKR </span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
                      value={newInvoice.total_amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, total_amount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services/Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Consultation, Lab Test, etc."
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate Invoice'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInvoiceForm(false)}
                    className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* View Details Modal */}
        {showDetailsModal && selectedBill && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 max-w-lg w-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                  <p className="text-gray-600">{selectedBill.invoiceNo}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Patient Name</p>
                    <p className="font-bold">{selectedBill.patientName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Patient ID</p>
                    <p className="font-bold">{selectedBill.patientId}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Invoice Date</p>
                    <p className="font-bold">{selectedBill.date}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBill.status)}`}>
                      {selectedBill.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Services Provided</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-600">Service</th>
                          <th className="px-4 py-2 text-right text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedBill.services.map((service, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">{service}</td>
                            <td className="px-4 py-2 text-right">LKR ---</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Amount</span>
                    <span className="font-bold text-gray-900">LKR {selectedBill.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Amount Paid</span>
                    <span className="font-bold text-green-600">LKR {selectedBill.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Balance Due</span>
                    <span className="text-red-600">LKR {selectedBill.balance.toFixed(2)}</span>
                  </div>
                </div>

                {selectedBill.notes && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-sm font-bold text-amber-800">Internal Notes</p>
                    <p className="text-sm text-amber-700">{selectedBill.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handlePrintInvoice(selectedBill);
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <FaPrint /> Print
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                >
                  Close
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
