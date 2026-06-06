import React, { useState, useEffect } from 'react';
import { fetchActivities, saveActivity, deleteActivity } from '../services/mockData';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [newAct, setNewAct] = useState({ name: '', baselineDailyQty: 0 });
  const [canEdit] = useState(true);

  const load = async () => {
    const data = await fetchActivities();
    setActivities(data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newAct.name.trim()) return;
    await saveActivity({
      name: newAct.name,
      baselineDailyQty: Number(newAct.baselineDailyQty) || 0,
      status: 'Pending'
    });
    setNewAct({ name: '', baselineDailyQty: 0 });
    await load();
  };

  const handleDelete = async (id) => {
    await deleteActivity(id);
    await load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Activity name"
          value={newAct.name}
          onChange={(e) => setNewAct({ ...newAct, name: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        <input
          type="number"
          placeholder="Baseline Daily QTY"
          value={newAct.baselineDailyQty}
          onChange={(e) => setNewAct({ ...newAct, baselineDailyQty: e.target.value })}
          className="border p-2 rounded w-40"
        />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr><th className="border p-2">Activity name</th><th className="border p-2">Baseline Daily QTY</th><th className="border p-2">Status</th><th className="border p-2">Actions</th></tr>
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.id}>
                <td className="border p-2">{act.name}</td>
                <td className="border p-2">{act.baselineDailyQty}</td>
                <td className="border p-2">{act.status}</td>
                <td className="border p-2"><button onClick={() => handleDelete(act.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
            {activities.length === 0 && <tr><td colSpan="4" className="text-center p-4">No activities yet. Add one above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
