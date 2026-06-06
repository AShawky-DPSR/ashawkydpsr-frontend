import React, { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';

function Reports() {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const downloadReport = async (type) => {
    setLoading(true);
    try {
      let url = '';
      let method = 'post';
      let payload = {};
      if (type === 'daily') {
        url = `/reports/daily?date=${date.toISOString().split('T')[0]}`;
        method = 'post';
      } else if (type === 'weekly') {
        url = `/reports/weekly`;
        method = 'post';
      } else if (type === 'monthly') {
        url = `/reports/monthly`;
        method = 'post';
      } else if (type === 'full') {
        url = `/reports/full`;
        method = 'post';
      } else if (type === 'pdf') {
        url = `/reports/pdf`;
        method = 'post';
      } else if (type === 'export_activities') {
        url = `/activities/export`;
        method = 'get';
      } else if (type === 'import_activities') {
        // handled separately
        return;
      } else if (type === 'forecast') {
        const res = await api.get('/forecast');
        toast.success(`Forecast: Completion on ${res.data.completion_date}, daily rate ${res.data.rate.toFixed(2)}`);
        return;
      }
      const response = await api[method](url, payload, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${type}_report.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleImportActivities = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/activities/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Activities imported successfully');
    } catch (error) {
      toast.error('Import failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📋 PROFESSIONAL REPORT GENERATOR</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date for Daily Report</label>
            <DatePicker selected={date} onChange={setDate} className="input" dateFormat="dd/MM/yyyy" />
          </div>
          <div></div>
          <button onClick={() => downloadReport('daily')} disabled={loading} className="btn-primary">📊 Daily Progress Report</button>
          <button onClick={() => downloadReport('weekly')} disabled={loading} className="btn-primary">📈 Weekly Progress Report</button>
          <button onClick={() => downloadReport('monthly')} disabled={loading} className="btn-primary">📉 Monthly Progress Report</button>
          <button onClick={() => downloadReport('full')} disabled={loading} className="btn-danger">💾 Full Database Export</button>
          <button onClick={() => downloadReport('export_activities')} disabled={loading} className="btn-primary">📤 Export Activities</button>
          <label className="btn-primary text-center cursor-pointer">
            📥 Import Activities
            <input type="file" accept=".xlsx, .xls" onChange={handleImportActivities} className="hidden" />
          </label>
          <button onClick={() => downloadReport('pdf')} disabled={loading} className="btn-primary">📄 PDF Report</button>
          <button onClick={() => downloadReport('forecast')} disabled={loading} className="btn-primary">🤖 AI Forecast Report</button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
