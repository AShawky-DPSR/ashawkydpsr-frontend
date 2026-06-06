import React from 'react';

const Reports = () => {
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

  const getDailyEntriesCSV = () => {
    const entries = JSON.parse(localStorage.getItem('dailyEntries') || '[]');
    if (entries.length === 0) return "No data available";
    const headers = "Date,Activity,Engineer,Planned,Actual,Unit,Cumulative,Status\n";
    const rows = entries.map(e => `${e.date},${e.activity},${e.engineer},${e.plannedQty},${e.actualQty},${e.unit},${e.cumulative},${e.actualQty >= e.plannedQty ? 'On Track' : 'Behind'}`).join('\n');
    return headers + rows;
  };

  const getActivitiesCSV = () => {
    const acts = JSON.parse(localStorage.getItem('activities') || '[]');
    if (acts.length === 0) return "No activities";
    const headers = "Name,Baseline Daily QTY,Status\n";
    const rows = acts.map(a => `${a.name},${a.baselineDailyQty},${a.status}`).join('\n');
    return headers + rows;
  };

  const getFullDBExport = () => {
    const data = {
      dailyEntries: JSON.parse(localStorage.getItem('dailyEntries') || '[]'),
      activities: JSON.parse(localStorage.getItem('activities') || '[]'),
      progress: JSON.parse(localStorage.getItem('progressItems') || '[]'),
      settings: {
        engineerEditWindow: localStorage.getItem('engineerEditWindow') || 24,
        licenseExpiry: localStorage.getItem('licenseExpiry') || '2026-07-01',
      }
    };
    return JSON.stringify(data, null, 2);
  };

  const exportDaily = () => downloadCSV(`daily_report_${new Date().toISOString().slice(0,10)}.csv`, getDailyEntriesCSV());
  const exportWeekly = () => downloadCSV(`weekly_report_${new Date().toISOString().slice(0,10)}.csv`, getDailyEntriesCSV()); // same for demo
  const exportMonthly = () => downloadCSV(`monthly_report_${new Date().toISOString().slice(0,10)}.csv`, getDailyEntriesCSV());
  const exportActivities = () => downloadCSV(`activities_${new Date().toISOString().slice(0,10)}.csv`, getActivitiesCSV());
  const exportFullDB = () => downloadCSV(`full_export_${new Date().toISOString().slice(0,10)}.json`, getFullDBExport());

  const printToPDF = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Progress Report</title></head>
      <body><h1>Daily Progress Report</h1><pre>${getDailyEntriesCSV()}</pre>
      <p>Use browser's Save as PDF option.</p></body></html>
    `);
    win.document.close();
    win.print();
  };

  const aiForecast = () => {
    alert("AI Forecast: Based on current data, completion expected by July 15, 2026. (Connect real AI endpoint later)");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={exportDaily} className="bg-blue-500 text-white p-2 rounded">Daily Progress Report</button>
        <button onClick={exportWeekly} className="bg-blue-500 text-white p-2 rounded">Weekly Progress Report</button>
        <button onClick={exportMonthly} className="bg-blue-500 text-white p-2 rounded">Monthly Progress Report</button>
        <button onClick={printToPDF} className="bg-green-600 text-white p-2 rounded">PDF Report</button>
        <button onClick={exportActivities} className="bg-purple-500 text-white p-2 rounded">Export Activities</button>
        <button onClick={exportFullDB} className="bg-purple-500 text-white p-2 rounded">Full Database Export</button>
        <button onClick={() => alert("Import feature: upload CSV")} className="bg-yellow-500 text-white p-2 rounded">Import Activities</button>
        <button onClick={aiForecast} className="bg-red-500 text-white p-2 rounded">AI Forecast Report</button>
      </div>
    </div>
  );
};

export default Reports;
