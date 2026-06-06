import React, { useState, useEffect } from 'react';

const ProgressMonitor = () => {
  const [items, setItems] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newItem, setNewItem] = useState({ activity: '', assignee: '', dueDate: '', status: 'Not Started' });

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem('progressItems') || '[]'));
    setActivities(JSON.parse(localStorage.getItem('activities') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('progressItems', JSON.stringify(items));
  }, [items]);

  const add = () => {
    if (newItem.activity) {
      setItems([...items, { id: Date.now(), ...newItem }]);
      setNewItem({ activity: '', assignee: '', dueDate: '', status: 'Not Started' });
    }
  };

  const updateStatus = (id, status) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const del = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Progress Monitor</h1>
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2 flex-wrap">
        <select value={newItem.activity} onChange={e => setNewItem({ ...newItem, activity: e.target.value })} className="border p-2 rounded">
          <option value="">Select Activity</option>
          {activities.map(a => <option key={a.id}>{a.name}</option>)}
        </select>
        <input type="text" placeholder="Assignee" value={newItem.assignee} onChange={e => setNewItem({ ...newItem, assignee: e.target.value })} className="border p-2 rounded" />
        <input type="date" value={newItem.dueDate} onChange={e => setNewItem({ ...newItem, dueDate: e.target.value })} className="border p-2 rounded" />
        <select value={newItem.status} onChange={e => setNewItem({ ...newItem, status: e.target.value })} className="border p-2 rounded">
          <option>Not Started</option><option>In Progress</option><option>Completed</option><option>Delayed</option>
        </select>
        <button onClick={add} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Activity</th><th>Assignee</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td className="border p-2">{i.activity}</td>
                <td className="border p-2">{i.assignee}</td>
                <td className="border p-2">{i.dueDate}</td>
                <td className="border p-2">
                  <select value={i.status} onChange={e => updateStatus(i.id, e.target.value)} className="border p-1 rounded">
                    <option>Not Started</option><option>In Progress</option><option>Completed</option><option>Delayed</option>
                  </select>
                </td>
                <td className="border p-2"><button onClick={() => del(i.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan="5" className="text-center p-4">No progress items</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressMonitor;
