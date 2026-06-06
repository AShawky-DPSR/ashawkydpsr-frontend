import React, { useState, useEffect } from 'react';

const Lookahead = () => {
  const [progress, setProgress] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem('progressItems');
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  const upcoming = progress.filter(p => p.status !== 'Completed').slice(0, 10);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lookahead (Upcoming Tasks)</h1>
      {upcoming.length === 0 ? (
        <p>No upcoming tasks. Add progress items in Progress Monitor.</p>
      ) : (
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Activity</th><th>Assignee</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {upcoming.map(item => (
              <tr key={item.id}>
                <td className="border p-2">{item.activity}</td>
                <td className="border p-2">{item.assignee}</td>
                <td className="border p-2">{item.dueDate}</td>
                <td className="border p-2">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Lookahead;
