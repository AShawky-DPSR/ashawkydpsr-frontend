import React, { useState, useEffect } from 'react';
import api from '../api';

function Audit() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/audit');
      setLogs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-primary mb-4">📜 SYSTEM AUDIT TRAIL</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead><tr className="bg-gray-100">
            <th className="px-4 py-2 border">User</th>
            <th className="px-4 py-2 border">Action</th>
            <th className="px-4 py-2 border">Timestamp</th>
          </tr></thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className="px-4 py-2 border">{log.username}</td>
                <td className="px-4 py-2 border">{log.action}</td>
                <td className="px-4 py-2 border">{log.timestamp}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan="3" className="text-center py-4 text-gray-500">No audit logs</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Audit;