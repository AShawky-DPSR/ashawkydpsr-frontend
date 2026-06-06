import React, { useState, useEffect } from 'react';
export default function Lookahead() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('progressItems') || '[]'));
  }, []);
  const upcoming = items.filter(i => i.status !== 'Completed');
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lookahead (Upcoming Tasks)</h1>
      {upcoming.length === 0 ? <p>No upcoming tasks.</p> : (
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Activity</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {upcoming.map(i => <tr key={i.id}><td className="border p-2">{i.activity}</td><td className="border p-2">{i.dueDate}</td><td className="border p-2">{i.status}</td></tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}
