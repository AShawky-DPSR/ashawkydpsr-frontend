import React from 'react';

const Reports = () => {
  // Helper: generate CSV and trigger download (no file-saver needed)
  const downloadCSV = (filename, data) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateMockData = () => {
    return "Date,Activity,Planned,Actual,Status\n2026-06-01,Activity A,100,95,On Track\n2026-06-02,Activity B,80,82,On Track";
  };

  const exportToCSV = (reportType) => {
    const data = generateMockData();
    downloadCSV(`${reportType}_${new Date().toISOString().slice(0,10)}.csv`, data);
  };

  // PDF export using browser's print (user can save as PDF from print dialog)
  const printReport = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Progress Report</title></head>
        <body>
          <h1>Daily Progress Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <pre>${generateMockData()}</pre>
          <p>Use browser's "Save as PDF" option from print dialog.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const aiForecast = () => {
    alert("AI Forecast (mock): Based on current progress, project completion expected by July 15, 2026. (Replace with real AI endpoint later)");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => exportToCSV('daily_report')} className="bg-blue-500 text-white p-2 rounded">Daily Progress Report</button>
        <button onClick={() => exportToCSV('weekly_report')} className="bg-blue-500 text-white p-2 rounded">Weekly Progress Report</button>
        <button onClick={() => exportToCSV('monthly_report')} className="bg-blue-500 text-white p-2 rounded">Monthly Progress Report</button>
        <button onClick={printReport} className="bg-green-600 text-white p-2 rounded">PDF Report (Print to PDF)</button>
        <button onClick={() => exportToCSV('activities_export')} className="bg-purple-500 text-white p-2 rounded">Export Activities</button>
        <button onClick={() => exportToCSV('full_db')} className="bg-purple-500 text-white p-2 rounded">Full Database Export</button>
        <button onClick={() => alert("Import feature: upload CSV file")} className="bg-yellow-500 text-white p-2 rounded">Import Activities</button>
        <button onClick={aiForecast} className="bg-red-500 text-white p-2 rounded">AI Forecast Report</button>
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Preview (mock data)</h2>
        <pre className="text-sm">{generateMockData()}</pre>
      </div>
    </div>
  );
};

export default Reports;
