import React, { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';

function Reports() {
  const [date, setDate] = useState(new Date());

  const downloadReport = async (type) => {
    try {
      let url = '';
      if (type === 'daily') {
        url = `/reports/daily?date=${date.toISOString().split('T')[0]}`;
      } else if (type === 'weekly') {
        url = `/reports/weekly`;
      } else if (type === 'monthly') {
        url = `/reports/monthly`;
      } else if (type === 'full') {
        url = `/reports/full`;
      }
      const response = await api.post(url, {}, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${type}_report.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to generate report');
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
          <button onClick={() => downloadReport('daily')} className="btn-primary">📊 Daily Progress Report</button>
          <button onClick={() => downloadReport('weekly')} className="btn-primary">📈 Weekly Progress Report</button>
          <button onClick={() => downloadReport('monthly')} className="btn-primary">📉 Monthly Progress Report</button>
          <button onClick={() => downloadReport('full')} className="btn-danger">💾 Full Database Export</button>
        </div>
      </div>
    </div>
  );
}

export default Reports;