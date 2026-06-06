import React, { useState, useEffect } from 'react';

const ProgressMonitor = () => {
  const [progress, setProgress] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newItem, setNewItem] = useState({ activity: '', assignee: '', dueDate: '', status: 'Not Started' });

  useEffect(() => {
    const storedProgress = localStorage.getItem('progressItems');
    if (storedProgress) setProgress(JSON.parse(storedProgress));
    const storedActs = localStorage.getItem('activities');
    if (storedActs) setActivities(JSON.parse(storedActs));
  }, []);

  useEffect(() => {
    localStorage.setItem('progressItems', JSON.stringify(progress));
  }, [progress]);

  const handleAdd = () => {
    if (!newItem.activity) return;
    const newProg = { id: Date.now(), ...newItem };
    setProgress([...progress, newProg]);
    setNewItem({ activity: '', assignee: '', dueDate: '', status: 'Not Started' });
  };

  const handleStatusChange = (id, newStatus) => {
    setProgress(progress.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleDelete = (id) => {
    setProgress(progress.filter(p => p.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Progress Monitor</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-2 flex-wrap">
          <select value={newItem.activity} onChange={(e) => setNewItem({...newItem, activity: e.target.value})} className="border p-2 rounded">
            <option value="">Select Activity</option>
            {activities.map(act => <option key={act.id} value={act.name}>{act.name}</option>)}
          </select>
          <input type="text" placeholder="Assignee" value={newItem.assignee} onChange={(e) => setNewItem({...newItem, assignee: e.target.value})} className="border p-2 rounded" />
          <input type="date" value={newItem.dueDate} onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})} className="border p-2 rounded" />
          <select value={newItem.status} onChange={(e) => setNewItem({...newItem, status: e.target.value})} className="border p-2 rounded">
            <option>Not Started</option><option>In Progress</option><option>Completed</option><option>Delayed</option>
          </select>
          <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Activity</th><th>Assignee</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {progress.map(p => (
              <tr key={p.id}>
                <td className="border p-2">{p.activity}</td>
                <td className="border p-2">{p.assignee}</td>
                <td className="border p-2">{p.dueDate}</td>
                <td className="border p-2">
                  <select value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value)} className="border p-1 rounded">
                    <option>Not Started</option><option>In Progress</option><option>Completed</option><option>Delayed</option>
                  </select>
                </td>
                <td className="border p-2"><button onClick={() => handleDelete(p.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
            {progress.length === 0 && <tr><td colSpan="5" className="text-center p-4">No progress items</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressMonitor;
