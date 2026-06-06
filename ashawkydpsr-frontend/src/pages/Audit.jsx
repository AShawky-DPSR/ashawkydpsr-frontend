import React, { useState, useEffect } from 'react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem('auditLog');
    if (stored) setLogs(JSON.parse(stored));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
      {logs.length === 0 ? (
        <p>No actions recorded yet. As you submit entries, they will appear here.</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100"><td><th className="border p-2">Timestamp</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td className="border p-2">{log.timestamp}</td>
                <td className="border p-2">{log.user}</td>
                <td className="border p-2">{log.action}</td>
                <td className="border p-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLog;
