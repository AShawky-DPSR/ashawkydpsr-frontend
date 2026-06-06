import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [engineerEditWindow, setEngineerEditWindow] = useState(24);
  const [monthlyReportCycle, setMonthlyReportCycle] = useState('Calendar Month');
  const [allowPlannersEdit, setAllowPlannersEdit] = useState(true);
  const [workCalendar, setWorkCalendar] = useState(['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']);
  const [licenseExpiry, setLicenseExpiry] = useState('2026-07-01');
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin', password: 'admin123' },
    { id: 2, username: 'planner1', role: 'planner', password: 'planner123' },
    { id: 3, username: 'engineer1', role: 'engineer', password: 'eng123' }
  ]);
  const [newUser, setNewUser] = useState({ username: '', role: 'engineer', password: '' });

  useEffect(() => {
    const stored = localStorage.getItem('appSettings');
    if (stored) {
      const s = JSON.parse(stored);
      setEngineerEditWindow(s.engineerEditWindow || 24);
      setMonthlyReportCycle(s.monthlyReportCycle || 'Calendar Month');
      setAllowPlannersEdit(s.allowPlannersEdit !== undefined ? s.allowPlannersEdit : true);
      setWorkCalendar(s.workCalendar || ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']);
      setLicenseExpiry(s.licenseExpiry || '2026-07-01');
    }
    const storedUsers = localStorage.getItem('appUsers');
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  }, []);

  const saveAll = () => {
    const settings = { engineerEditWindow, monthlyReportCycle, allowPlannersEdit, workCalendar, licenseExpiry };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    localStorage.setItem('appUsers', JSON.stringify(users));
    localStorage.setItem('licenseExpiry', licenseExpiry);
    alert('Settings saved (localStorage)');
  };

  const addUser = () => {
    if (!newUser.username) return;
    setUsers([...users, { id: Date.now(), ...newUser }]);
    setNewUser({ username: '', role: 'engineer', password: '' });
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const toggleWorkDay = (day) => {
    if (workCalendar.includes(day)) setWorkCalendar(workCalendar.filter(d => d !== day));
    else setWorkCalendar([...workCalendar, day]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Report Configuration</h2>
          <label>Engineer Edit Window (hours)</label>
          <input type="number" value={engineerEditWindow} onChange={(e) => setEngineerEditWindow(e.target.value)} className="border p-2 w-full mb-2" />
          <label>Monthly Report Cycle</label>
          <select value={monthlyReportCycle} onChange={(e) => setMonthlyReportCycle(e.target.value)} className="border p-2 w-full mb-2">
            <option>Calendar Month</option><option>Fiscal Month</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={allowPlannersEdit} onChange={(e) => setAllowPlannersEdit(e.target.checked)} />
            Allow Planners to add/edit/delete activities
          </label>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Work Calendar</h2>
          {['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'].map(day => (
            <label key={day} className="flex items-center gap-2">
              <input type="checkbox" checked={workCalendar.includes(day)} onChange={() => toggleWorkDay(day)} /> {day}
            </label>
          ))}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="border p-1" />
            <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="border p-1">
              <option>admin</option><option>planner</option><option>engineer</option>
            </select>
            <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="border p-1" />
            <button onClick={addUser} className="bg-blue-500 text-white px-2 rounded">Add</button>
          </div>
          <table className="w-full border">
            <thead className="bg-gray-50"><tr><th>User</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => <tr key={u.id}><td>{u.username}</td><td>{u.role}</td><td><button onClick={() => deleteUser(u.id)} className="text-red-500">Delete</button></td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">License Management</h2>
          <p>Current Expiry: {licenseExpiry}</p>
          <input type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} className="border p-1" />
          <button className="bg-green-600 text-white px-4 py-1 rounded ml-2">Extend License</button>
        </div>
      </div>
      <button onClick={saveAll} className="mt-6 bg-blue-700 text-white px-6 py-2 rounded">SAVE ALL SETTINGS</button>
    </div>
  );
};

export default Settings;
