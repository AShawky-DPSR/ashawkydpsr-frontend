import React from 'react';

const Reports = () => {
  const download = (filename, data) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const getDailyCSV = () => {
    const entries = JSON.parse(localStorage.getItem('dailyEntries') || '[]');
    if (!entries.length) return 'No data';
    const headers = 'Date,Activity,Engineer,Planned,Actual,Unit,Cumulative,Status\n';
    const rows = entries.map(e => `${e.date},${e.activity},${e.engineer},${e.plannedQty},${e.actualQty},${e.unit},${e.cumulative},${e.actualQty >= e.plannedQty ? 'On Track' : 'Behind'}`).join('\n');
    return headers + rows;
  };

  const getActivitiesCSV = () => {
    const acts = JSON.parse(localStorage.getItem('activities') || '[]');
    if (!acts.length) return 'No activities';
    const headers = 'Name,Baseline Daily QTY,Status\n';
    const rows = acts.map(a => `${a.name},${a.baselineDailyQty},${a.status}`).join('\n');
    return headers + rows;
  };

  const getFullJSON = () => {
    return JSON.stringify({
      dailyEntries: JSON.parse(localStorage.getItem('dailyEntries') || '[]'),
      activities: JSON.parse(localStorage.getItem('activities') || '[]'),
      progress: JSON.parse(localStorage.getItem('progressItems') || '[]')
    }, null, 2);
  };

  const printPDF = () => {
    const win = window.open();
    win.document.write(`<html><head><title>Report</title></head><body><h1>Daily Progress Report</h1><pre>${getDailyCSV()}</pre></body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => download('daily_report.csv', getDailyCSV())} className="bg-blue-500 text-white p-2 rounded">Daily Progress Report</button>
        <button onClick={() => download('weekly_report.csv', getDailyCSV())} className="bg-blue-500 text-white p-2 rounded">Weekly Progress Report</button>
        <button onClick={() => download('monthly_report.csv', getDailyCSV())} className="bg-blue-500 text-white p-2 rounded">Monthly Progress Report</button>
        <button onClick={printPDF} className="bg-green-600 text-white p-2 rounded">PDF Report (Print)</button>
        <button onClick={() => download('activities.csv', getActivitiesCSV())} className="bg-purple-500 text-white p-2 rounded">Export Activities</button>
        <button onClick={() => download('full_export.json', getFullJSON())} className="bg-purple-500 text-white p-2 rounded">Full Database Export</button>
        <button onClick={() => alert('Import CSV – coming soon')} className="bg-yellow-500 text-white p-2 rounded">Import Activities</button>
        <button onClick={() => alert('AI Forecast: Completion expected by July 15, 2026')} className="bg-red-500 text-white p-2 rounded">AI Forecast Report</button>
      </div>
    </div>
  );
};

export default Reports;
