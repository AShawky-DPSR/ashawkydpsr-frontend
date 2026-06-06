import React from 'react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // optional but helps

const Reports = () => {
  const generateCSV = (type) => {
    const headers = "Date,Activity,Planned,Actual,Status\n";
    const mockRows = "2026-06-01,Activity A,100,95,On Track\n2026-06-02,Activity B,80,82,On Track";
    const blob = new Blob([headers + mockRows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${type}_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Progress Report", 20, 20);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.autoTable({
      startY: 40,
      head: [['Date', 'Activity', 'Planned', 'Actual', 'Status']],
      body: [
        ['2026-06-01', 'Activity A', '100', '95', 'On Track'],
        ['2026-06-02', 'Activity B', '80', '82', 'On Track'],
      ]
    });
    doc.save(`report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const aiForecast = () => {
    alert("AI Forecast (mock): Based on current progress, project completion expected by July 15, 2026. (Connect real AI endpoint later)");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => generateCSV('daily_report')} className="bg-blue-500 text-white p-2 rounded">Daily Progress Report</button>
        <button onClick={() => generateCSV('weekly_report')} className="bg-blue-500 text-white p-2 rounded">Weekly Progress Report</button>
        <button onClick={() => generateCSV('monthly_report')} className="bg-blue-500 text-white p-2 rounded">Monthly Progress Report</button>
        <button onClick={generatePDF} className="bg-green-600 text-white p-2 rounded">PDF Report</button>
        <button onClick={() => generateCSV('activities_export')} className="bg-purple-500 text-white p-2 rounded">Export Activities</button>
        <button onClick={() => generateCSV('full_db')} className="bg-purple-500 text-white p-2 rounded">Full Database Export</button>
        <button onClick={() => alert("Import feature: upload CSV file")} className="bg-yellow-500 text-white p-2 rounded">Import Activities</button>
        <button onClick={aiForecast} className="bg-red-500 text-white p-2 rounded">AI Forecast Report</button>
      </div>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Preview (mock data)</h2>
        <pre className="text-sm">Date,Activity,Planned,Actual\n2026-06-01,Test,100,95</pre>
      </div>
    </div>
  );
};

export default Reports;
