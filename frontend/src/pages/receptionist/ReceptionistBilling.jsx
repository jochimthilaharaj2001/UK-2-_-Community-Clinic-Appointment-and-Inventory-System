import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { FaSearch, FaPlus, FaPrint, FaFileInvoiceDollar, FaMoneyBillWave, FaCreditCard, FaCalendarAlt, FaUser, FaDownload } from 'react-icons/fa';

const ReceptionistBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/receptionist/billing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBills(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash',
    referenceNo: '',
    notes: ''
  });
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceFormData, setInvoiceFormData] = useState({
    patientId: '',
    services: [{ description: '', amount: '' }]
  });

  const filteredBills = bills.filter(bill => {
    const matchesSearch = (bill.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.invoice_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.patient_id || '').toString().includes(searchTerm);
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
    const total = bills.reduce((sum, bill) => sum + Number(bill.total_amount || 0), 0);
    const paid = bills.reduce((sum, bill) => sum + Number(bill.paid_amount || 0), 0);
    const balance = bills.reduce((sum, bill) => sum + Number(bill.balance || 0), 0);

    return { total, paid, balance };
  };

  const totals = calculateTotal();

  const handleExportData = () => {
    if (filteredBills.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Invoice No', 'Date', 'Patient Name', 'Patient ID', 'Services', 'Total Amount', 'Paid Amount', 'Balance', 'Status'];
    const csvData = filteredBills.map(bill => [
      `"${bill.invoice_no}"`,
      `"${new Date(bill.created_at).toLocaleDateString()}"`,
      `"${bill.patient_name}"`,
      `"${bill.patient_id}"`,
      `"${(bill.services || []).join(', ')}"`,
      `"${Number(bill.total_amount).toFixed(2)}"`,
      `"${Number(bill.paid_amount).toFixed(2)}"`,
      `"${Number(bill.balance).toFixed(2)}"`,
      `"${bill.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `billing_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateInvoice = () => {
    setShowInvoiceForm(true);
    setInvoiceFormData({
      patientId: '',
      services: [{ description: '', amount: '' }]
    });
  };

  const handleAddService = () => {
    setInvoiceFormData({
      ...invoiceFormData,
      services: [...invoiceFormData.services, { description: '', amount: '' }]
    });
  };

  const handleRemoveService = (index) => {
    const newServices = invoiceFormData.services.filter((_, i) => i !== index);
    setInvoiceFormData({ ...invoiceFormData, services: newServices });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...invoiceFormData.services];
    newServices[index][field] = value;
    setInvoiceFormData({ ...invoiceFormData, services: newServices });
  };

  const handleCreateInvoice = async () => {
    if (!invoiceFormData.patientId) {
      alert('Please enter patient ID');
      return;
    }

    const validServices = invoiceFormData.services.filter(s => s.description && s.amount);
    if (validServices.length === 0) {
      alert('Please add at least one service');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/receptionist/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: invoiceFormData.patientId,
          services: validServices
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Invoice ${data.invoiceNo} created successfully!`);
        setShowInvoiceForm(false);
        fetchBills();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create invoice');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating invoice');
    }
  };

  const handleProcessPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/receptionist/billing/${selectedBill.id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      if (response.ok) {
        setShowPaymentForm(false);
        fetchBills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintInvoice = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${bill.invoice_no}</title>
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
            <h3>Invoice #${bill.invoice_no}</h3>
          </div>
          
          <div class="details">
            <div><strong>Date:</strong> ${new Date(bill.created_at).toLocaleDateString()}</div>
            <div><strong>Patient:</strong> ${bill.patient_name} (ID: ${bill.patient_id})</div>
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
              ${(bill.service_details || []).map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>$${Number(item.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total Amount:</strong></td>
                <td><strong>$${Number(bill.total_amount).toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td><strong>Paid Amount:</strong></td>
                <td><strong>$${Number(bill.paid_amount).toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td><strong>Balance Due:</strong></td>
                <td><strong>$${Number(bill.balance).toFixed(2)}</strong></td>
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
            onClick={handleGenerateInvoice}
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
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">${totals.total.toFixed(2)}</h3>
            <p className="text-gray-600">Total Billing Amount</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FaCreditCard className="text-2xl" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">${totals.paid.toFixed(2)}</h3>
            <p className="text-gray-600">Total Received</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <FaFileInvoiceDollar className="text-2xl" />
              </div>
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
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                ) : filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-gray-900">{bill.invoice_no}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(bill.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                          <FaUser size={14} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{bill.patient_name}</p>
                          <p className="text-xs text-gray-500">{bill.patient_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-gray-900">${Number(bill.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Balance: ${Number(bill.balance).toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                        <p className={`text-xs mt-1 ${getPaymentMethodColor(bill.payment_method)}`}>
                          {bill.payment_method}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {bill.status !== 'Paid' && (
                          <button
                            onClick={() => { setSelectedBill(bill); setShowPaymentForm(true); }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Receive Payment"
                          >
                            <FaMoneyBillWave />
                          </button>
                        )}
                        <button
                          onClick={() => handlePrintInvoice(bill)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Print Invoice"
                        >
                          <FaPrint />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Pay</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="insurance">Insurance</option>
                    <option value="upi">UPI/Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference No.</label>
                  <input
                    type="text"
                    value={paymentData.referenceNo}
                    onChange={(e) => setPaymentData({ ...paymentData, referenceNo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Transaction ID / Check No."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleProcessPayment}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg"
                >
                  Confirm Payment
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate New Invoice</h2>

              <div className="space-y-6">
                {/* Patient ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={invoiceFormData.patientId}
                    onChange={(e) => setInvoiceFormData({ ...invoiceFormData, patientId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter patient ID"
                  />
                </div>

                {/* Services */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services *
                  </label>
                  {invoiceFormData.services.map((service, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Service description"
                      />
                      <input
                        type="number"
                        value={service.amount}
                        onChange={(e) => handleServiceChange(index, 'amount', e.target.value)}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Amount"
                        step="0.01"
                      />
                      {invoiceFormData.services.length > 1 && (
                        <button
                          onClick={() => handleRemoveService(index)}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddService}
                    className="mt-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg text-sm"
                  >
                    + Add Service
                  </button>
                </div>

                {/* Total Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${invoiceFormData.services.reduce((sum, s) => sum + (Number(s.amount) || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCreateInvoice}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg"
                >
                  Create Invoice
                </button>
                <button
                  onClick={() => setShowInvoiceForm(false)}
                  className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default ReceptionistBilling;