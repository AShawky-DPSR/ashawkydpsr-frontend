import React, { useState, useEffect } from 'react';

const DailyEntry = () => {
  const [entries, setEntries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    activity: '',
    engineer: '',
    plannedQty: 0,
    actualQty: 0,
    unit: 'Kg',
    manpower: 0,
    equipment: '',
    material: '',
    issues: '',
    nextDayPlan: ''
  });

  useEffect(() => {
    setEntries(JSON.parse(localStorage.getItem('dailyEntries') || '[]'));
    setActivities(JSON.parse(localStorage.getItem('activities') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyEntries', JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cumulative = entries.reduce((sum, e) => sum + Number(e.actualQty), 0) + Number(form.actualQty);
    const newEntry = { id: Date.now(), ...form, cumulative };
    setEntries([newEntry, ...entries]);
    // reset
    setForm({
      date: new Date().toISOString().slice(0,10),
      activity: '',
      engineer: '',
      plannedQty: 0,
      actualQty: 0,
      unit: 'Kg',
      manpower: 0,
      equipment: '',
      material: '',
      issues: '',
      nextDayPlan: ''
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
          <div><label className="block font-semibold">Date</label><input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 w-full" required /></div>
          <div><label className="block font-semibold">Activity</label><select name="activity" value={form.activity} onChange={handleChange} className="border p-2 w-full" required><option value="">Select Activity</option>{activities.map(a=><option key={a.id}>{a.name}</option>)}</select></div>
          <div><label className="block font-semibold">Engineer</label><input type="text" name="engineer" value={form.engineer} onChange={handleChange} className="border p-2 w-full" /></div>
          <div><label className="block font-semibold">Planned Qty</label><input type="number" name="plannedQty" value={form.plannedQty} onChange={handleChange} className="border p-2 w-full" /></div>
          <div><label className="block font-semibold">Actual Qty</label><input type="number" name="actualQty" value={form.actualQty} onChange={handleChange} className="border p-2 w-full" /></div>
          <div><label className="block font-semibold">Unit</label><input type="text" name="unit" value={form.unit} onChange={handleChange} className="border p-2 w-full" /></div>
          <div><label className="block font-semibold">Manpower</label><input type="number" name="manpower" value={form.manpower} onChange={handleChange} className="border p-2 w-full" /></div>
          <div><label className="block font-semibold">Equipment</label><input type="text" name="equipment" value={form.equipment} onChange={handleChange} className="border p-2 w-full" /></div>
          <div><label className="block font-semibold">Material</label><input type="text" name="material" value={form.material} onChange={handleChange} className="border p-2 w-full" /></div>
          <div className="col-span-2"><label className="block font-semibold">Issues / Challenges</label><textarea name="issues" value={form.issues} onChange={handleChange} className="border p-2 w-full" rows="2"></textarea></div>
          <div className="col-span-2"><label className="block font-semibold">Next Day Plan</label><textarea name="nextDayPlan" value={form.nextDayPlan} onChange={handleChange} className="border p-2 w-full" rows="2"></textarea></div>
          <div className="col-span-2"><label className="block font-semibold">Attach Photos</label><input type="file" multiple className="border p-2 w-full" /></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">SUBMIT</button>
          <button type="button" onClick={() => setForm({...form, plannedQty:0, actualQty:0, manpower:0, equipment:'', material:'', issues:'', nextDayPlan:''})} className="bg-gray-400 text-white px-4 py-2 rounded">CLEAR</button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-2">📋 RECENT ENTRIES</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Date</th><th>Activity</th><th>Engineer</th><th>Planned</th><th>Actual</th><th>Unit</th><th>Cumulative</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {entries.length === 0 ? <tr><td colSpan="9" className="text-center p-4">No entries yet</td></tr> :
              entries.map(e => (
                <tr key={e.id}>
                  <td className="border p-2">{e.date}</td>
                  <td className="border p-2">{e.activity}</td>
                  <td className="border p-2">{e.engineer}</td>
                  <td className="border p-2">{e.plannedQty}</td>
                  <td className="border p-2">{e.actualQty}</td>
                  <td className="border p-2">{e.unit}</td>
                  <td className="border p-2">{e.cumulative}</td>
                  <td className="border p-2">{e.actualQty >= e.plannedQty ? '✅ On Track' : '⚠️ Behind'}</td>
                  <td className="border p-2"><button onClick={() => handleDelete(e.id)} className="text-red-500">Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyEntry;
