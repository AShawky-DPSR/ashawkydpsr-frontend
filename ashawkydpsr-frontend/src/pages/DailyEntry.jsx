import React, { useState, useEffect } from 'react';

const DailyEntry = () => {
  const [entries, setEntries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activity: '',
    engineer: '',
    plannedQty: 0,
    actualQty: 0,
    unit: 'Kg',
    manpower: 0,
    equipment: '',
    material: '',
    issues: '',
    nextDayPlan: '',
  });

  // Load data from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('dailyEntries');
    if (storedEntries) setEntries(JSON.parse(storedEntries));
    const storedActs = localStorage.getItem('activities');
    if (storedActs) setActivities(JSON.parse(storedActs));
  }, []);

  // Save entries whenever they change
  useEffect(() => {
    localStorage.setItem('dailyEntries', JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cumulative = entries.reduce((sum, e) => sum + Number(e.actualQty), 0) + Number(formData.actualQty);
    const newEntry = {
      id: Date.now(),
      ...formData,
      cumulative,
      timestamp: new Date().toLocaleString(),
    };
    setEntries([newEntry, ...entries]);
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      activity: '',
      engineer: '',
      plannedQty: 0,
      actualQty: 0,
      unit: 'Kg',
      manpower: 0,
      equipment: '',
      material: '',
      issues: '',
      nextDayPlan: '',
    });
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Entry</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 w-full" required />
          </div>
          <div>
            <label className="block font-semibold">Activity</label>
            <select name="activity" value={formData.activity} onChange={handleChange} className="border p-2 w-full" required>
              <option value="">Select Activity</option>
              {activities.map(act => <option key={act.id} value={act.name}>{act.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold">Engineer</label>
            <input type="text" name="engineer" value={formData.engineer} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold">Planned Qty</label>
            <input type="number" name="plannedQty" value={formData.plannedQty} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold">Actual Qty</label>
            <input type="number" name="actualQty" value={formData.actualQty} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold">Unit</label>
            <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold">Manpower</label>
            <input type="number" name="manpower" value={formData.manpower} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold">Equipment</label>
            <input type="text" name="equipment" value={formData.equipment} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold">Material</label>
            <input type="text" name="material" value={formData.material} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold">Issues / Challenges</label>
            <textarea name="issues" value={formData.issues} onChange={handleChange} className="border p-2 w-full" rows="2"></textarea>
          </div>
          <div className="col-span-2">
            <label className="block font-semibold">Next Day Plan</label>
            <textarea name="nextDayPlan" value={formData.nextDayPlan} onChange={handleChange} className="border p-2 w-full" rows="2"></textarea>
          </div>
          <div className="col-span-2">
            <label className="block font-semibold">Attach Photos</label>
            <input type="file" multiple className="border p-2 w-full" />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">SUBMIT</button>
          <button type="button" onClick={() => setFormData({ ...formData, plannedQty: 0, actualQty: 0, manpower: 0, equipment: '', material: '', issues: '', nextDayPlan: '' })} className="bg-gray-400 text-white px-4 py-2 rounded">CLEAR</button>
        </div>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-2">📋 RECENT ENTRIES</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Date</th><th>Activity</th><th>Engineer</th><th>Planned</th><th>Actual</th><th>Unit</th><th>Cumulative</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan="9" className="text-center p-4">No entries yet</td></tr>
            ) : (
              entries.map(entry => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.date}</td>
                  <td className="border p-2">{entry.activity}</td>
                  <td className="border p-2">{entry.engineer}</td>
                  <td className="border p-2">{entry.plannedQty}</td>
                  <td className="border p-2">{entry.actualQty}</td>
                  <td className="border p-2">{entry.unit}</td>
                  <td className="border p-2">{entry.cumulative}</td>
                  <td className="border p-2">{entry.actualQty >= entry.plannedQty ? '✅ On Track' : '⚠️ Behind'}</td>
                  <td className="border p-2"><button onClick={() => handleDelete(entry.id)} className="text-red-500">Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyEntry;
