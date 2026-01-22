import Sidebar from '../../components/Sidebar';
import { FaFilePdf, FaPrint, FaBoxes, FaPills, FaExclamationTriangle } from 'react-icons/fa';
import { useState, useEffect } from "react";
import API_BASE_URL from "../../config/apiConfig";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {

const [reportData, setReportData] = useState({
  inventory: [],
  lowStock: [],
  dispensed: []   
});


useEffect(() => {
  const token = localStorage.getItem("token");

  Promise.all([
    fetch(`${API_BASE_URL}/reports/inventory`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    }).then(res => {
      if (!res.ok) throw new Error('Inventory report failed');
      return res.json();
    }).catch(err => {
      console.error("Inventory report error:", err);
      return [];
    }),

    fetch(`${API_BASE_URL}/reports/low-stock`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (!res.ok) throw new Error('Low stock report failed');
      return res.json();
    }).catch(err => {
      console.error("Low stock report error:", err);
      return [];
    }),

    fetch(`${API_BASE_URL}/reports/dispensed`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (!res.ok) throw new Error('Dispensed report failed');
      return res.json();
    }).catch(err => {
      console.error("Dispensed report error:", err);
      return [];
    }),
  ])
    .then(([inventory, lowStock, dispensed]) => {
      setReportData({
        inventory: Array.isArray(inventory) ? inventory : [],
        lowStock: Array.isArray(lowStock) ? lowStock : [],
        dispensed: Array.isArray(dispensed) ? dispensed : []
      });
    })
    .catch(err => {
      console.error("Failed to load report data:", err);
      alert("Failed to load report data");
    });
}, []);

const generatePDF = (title, columns, rows) => {
  try {
    console.log("Starting PDF generation for:", title);
    console.log("Rows count:", rows.length);
    console.log("Columns:", columns);

    if (!rows || rows.length === 0) {
      alert("No data available to generate report");
      return;
    }

    // Filter out rows with all empty values
    const validRows = rows.filter(row => 
      Array.isArray(row) && row.some(cell => cell !== undefined && cell !== null && cell !== '')
    );

    console.log("Valid rows count:", validRows.length);

    if (validRows.length === 0) {
      alert("No valid data available to generate report");
      return;
    }

    // Create PDF with proper orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add header
    doc.setFontSize(16);
    doc.text("Community Clinic Management System", 14, 15);

    doc.setFontSize(12);
    doc.text(title, 14, 25);

    // Try to use autoTable if available, otherwise use simple table
    try {
      if (doc.autoTable) {
        doc.autoTable({
          startY: 35,
          head: [columns],
          body: validRows,
          styles: { 
            fontSize: 9, 
            cellPadding: 3,
            overflow: 'linebreak',
            halign: 'left'
          },
          headStyles: { 
            fillColor: [22, 160, 133], 
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 10, right: 10, bottom: 10, left: 10 },
          didDrawPage: (data) => {
            // Add footer
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.getHeight();
            
            doc.setFontSize(8);
            doc.text(
              `Generated on: ${new Date().toLocaleString()}`,
              10,
              pageHeight - 10
            );
          }
        });
      } else {
        throw new Error("autoTable not available, using fallback");
      }
    } catch (tableError) {
      console.warn("autoTable error, using fallback table:", tableError);
      
      // Fallback: Properly formatted table with clean borders
      let yPosition = 35;
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginLeft = 10;
      const marginRight = 10;
      const cellHeight = 8;
      const availableWidth = pageWidth - marginLeft - marginRight;
      const colCount = columns.length;
      const colWidth = availableWidth / colCount;
      
      // Draw header row with border
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.setFillColor(22, 160, 133);
      
      // First pass: Draw header background and borders
      columns.forEach((col, idx) => {
        const x = marginLeft + idx * colWidth;
        const y = yPosition;
        
        // Fill background
        doc.rect(x, y, colWidth, cellHeight, 'F');
        
        // Draw border
        doc.setDrawColor(22, 160, 133);
        doc.setLineWidth(0.3);
        doc.rect(x, y, colWidth, cellHeight);
      });
      
      // Second pass: Set text color and draw text
      doc.setTextColor(255, 255, 255);  // White text
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      
      columns.forEach((col, idx) => {
        const x = marginLeft + idx * colWidth;
        const y = yPosition;
        
        // Draw text centered
        doc.text(
          col,
          x + 1,
          y + cellHeight / 2 + 1.5,
          { maxWidth: colWidth - 2, align: 'left' }
        );
      });
      
      yPosition += cellHeight;
      
      // Draw data rows
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      let alternateColor = false;
      
      validRows.forEach((row, rowIdx) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 15;
        }
        
        // Set alternate row background colors
        if (alternateColor) {
          doc.setFillColor(245, 245, 245);  // Light gray
        } else {
          doc.setFillColor(255, 255, 255);  // White
        }
        
        // Draw row cells
        row.forEach((cell, colIdx) => {
          const x = marginLeft + colIdx * colWidth;
          const y = yPosition;
          const cellContent = String(cell || '').substring(0, 30);
          
          // Fill background
          doc.rect(x, y, colWidth, cellHeight, 'F');
          
          // Draw border
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.2);
          doc.rect(x, y, colWidth, cellHeight);
        });
        
        // Now set text color and draw all text for this row
        doc.setTextColor(0, 0, 0);  // Black text
        doc.setFont(undefined, 'normal');
        
        row.forEach((cell, colIdx) => {
          const x = marginLeft + colIdx * colWidth;
          const y = yPosition;
          const cellContent = String(cell || '').substring(0, 30);
          
          // Draw text
          doc.text(
            cellContent,
            x + 1,
            y + cellHeight / 2 + 1.5,
            { maxWidth: colWidth - 2, align: 'left' }
          );
        });
        
        yPosition += cellHeight;
        alternateColor = !alternateColor;
      });
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont(undefined, 'normal');
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        marginLeft,
        pageHeight - 10
      );
    }

    // Save the PDF
    const filename = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    doc.save(filename);
    console.log("PDF saved successfully:", filename);
    alert("PDF generated successfully!");

  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error stack:", error.stack);
    alert(`Failed to generate PDF: ${error.message}`);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 relative z-10">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Reports</h1>
          <p className="text-gray-500">
            View and generate inventory and prescription-related reports
          </p>
          <div className="mt-3 text-sm text-gray-600">
            <p>Inventory Records: <span className="font-semibold">{reportData.inventory.length}</span></p>
            <p>Low Stock Items: <span className="font-semibold">{reportData.lowStock.length}</span></p>
            <p>Dispensed Medicines: <span className="font-semibold">{reportData.dispensed.length}</span></p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Inventory Status Report */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaBoxes className="text-blue-600 text-2xl" />
              <h2 className="text-lg font-semibold">Inventory Status Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Displays current stock levels, available medicines, and shortages.
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Total medicines in stock</li>
              <li>Low stock alerts</li>
              <li>Out-of-stock items</li>
            </ul>
            <div className="flex gap-3">
              <button
                  onClick={() => {
                    console.log("Inventory report button clicked");
                    console.log("Inventory data:", reportData.inventory);
                    
                    const columns = [
                      "Generic Name",
                      "Brand",
                      "Strength",
                      "Batch",
                      "Quantity",
                      "Expiry Date",
                      "Status"
                    ];

                    const rows = reportData.inventory.map(item => [
                      item.generic_name || 'N/A',
                      item.brand_name || 'N/A',
                      item.strength || 'N/A',
                      item.batch_number || 'N/A',
                      item.quantity || 0,
                      item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A',
                      item.status || 'N/A'
                    ]);

                    console.log("Generated rows:", rows);
                    generatePDF("Inventory Status Report", columns, rows);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FaFilePdf /> Export PDF
                </button>
            </div>
          </div>

          {/* Prescription / Dispense Report */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaPills className="text-green-600 text-2xl" />
              <h2 className="text-lg font-semibold">Prescription Dispense Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Summary of medicines dispensed based on prescriptions.
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Daily / Monthly dispensing trends</li>
              <li>Most dispensed medicines</li>
              <li>Prescription reference numbers</li>
            </ul>
            <div className="flex gap-3">
              <button
                  onClick={() => {
                    console.log("Dispensed report button clicked");
                    console.log("Dispensed data:", reportData.dispensed);
                    
                    const columns = [
                      "Prescription ID",
                      "Patient",
                      "Medicine",
                      "Qty",
                      "Dispensed Date"
                    ];

                    const rows = reportData.dispensed.map(item => [
                      item.prescription_id || 'N/A',
                      item.patient_name || 'N/A',
                      item.medicine_name || 'N/A',
                      item.quantity || 0,
                      item.dispensed_date ? new Date(item.dispensed_date).toLocaleDateString() : 'N/A'
                    ]);

                    console.log("Generated rows:", rows);
                    generatePDF("Prescription Dispense Report", columns, rows);
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <FaFilePdf /> Export PDF
              </button>
            </div>
          </div>

          {/* Expiry & Alerts Report */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
              <h2 className="text-lg font-semibold">Expiry & Alert Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Highlights expired medicines and upcoming expiry alerts.
            </p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Expired medicine list</li>
              <li>Medicines expiring within 30 days</li>
              <li>Batch-wise expiry details</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log("Low stock report button clicked");
                  console.log("Low stock data:", reportData.lowStock);
                  
                  const columns = [
                    "Generic Name",
                    "Brand Name",
                    "Batch",
                    "Quantity",
                    "Expiry Date",
                    "Status"
                  ];

                  const rows = reportData.lowStock.map(item => [
                    item.generic_name || 'N/A',
                    item.brand_name || 'N/A',
                    item.batch_number || 'N/A',
                    item.quantity || 0,
                    item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A',
                    item.status || 'N/A'
                  ]);

                  console.log("Generated rows:", rows);
                  generatePDF("Low Stock & Expiry Alert Report", columns, rows);
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <FaFilePdf /> Export PDF
              </button>
            </div>
          </div>

        </div>

        {/* Error Handling Note */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700">
            ⚠ If report data is unavailable or incomplete, the system will notify the user and prevent report generation.
          </p>
        </div>
      </main>
    </div>
  );
};


export default Report;
