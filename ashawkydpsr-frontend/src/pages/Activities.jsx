import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [baseline, setBaseline] = useState(0);

  useEffect(() => {
    setList(JSON.parse(localStorage.getItem('activities') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(list));
  }, [list]);

  const add = () => {
    if (name.trim()) {
      const newAct = { id: Date.now(), name, baselineDailyQty: Number(baseline), status: 'Pending' };
      setList([...list, newAct]);
      setName('');
      setBaseline(0);
    }
  };

  const del = (id) => {
    setList(list.filter(a => a.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <div className="flex gap-2 mb-6">
        <input type="text" placeholder="Activity name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded flex-grow" />
        <input type="number" placeholder="Baseline Daily QTY" value={baseline} onChange={e => setBaseline(e.target.value)} className="border p-2 rounded w-40" />
        <button onClick={add} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100"><tr><th className="border p-2">Activity name</th><th className="border p-2">Baseline Daily QTY</th><th className="border p-2">Status</th><th className="border p-2">Actions</th></tr></thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td className="border p-2">{a.name}</td>
                <td className="border p-2">{a.baselineDailyQty}</td>
                <td className="border p-2">{a.status}</td>
                <td className="border p-2"><button onClick={() => del(a.id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="4" className="text-center p-4">No activities yet. Add one above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
