import React, { useState, useEffect } from 'react';
export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem('auditLog') || '[]'));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
      {logs.length === 0 ? <p>No actions recorded yet.</p> : (
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Timestamp</th><th>Action</th><th>Details</th></tr></thead>
          <tbody>
            {logs.map((l, i) => <tr key={i}><td className="border p-2">{l.timestamp}</td><td className="border p-2">{l.action}</td><td className="border p-2">{l.details}</td></tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}
