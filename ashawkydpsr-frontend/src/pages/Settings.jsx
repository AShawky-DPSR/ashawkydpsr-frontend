import React, { useState, useEffect } from 'react';
import { fetchSettings, saveSettings } from '../services/mockData';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', role: 'engineer', password: '' });

  const load = async () => {
    const data = await fetchSettings();
    setSettings(data);
    setUsers(data.users || []);
  };

  useEffect(() => { load(); }, []);

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveAll = async () => {
    await saveSettings(settings);
    alert('Settings saved (mock)');
  };

  const addUser = async () => {
    if (!newUser.username) return;
    const updatedUsers = [...users, { id: Date.now(), ...newUser }];
    setUsers(updatedUsers);
    setSettings({ ...settings, users: updatedUsers });
    await saveSettings({ ...settings, users: updatedUsers });
    setNewUser({ username: '', role: 'engineer', password: '' });
  };

  const deleteUser = async (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    setSettings({ ...settings, users: updated });
    await saveSettings({ ...settings, users: updated });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Report Configuration</h2>
          <label>Engineer Edit Window (hours)</label>
          <input type="number" value={settings.engineerEditWindow || 24} onChange={(e) => updateSetting('engineerEditWindow', e.target.value)} className="border p-2 w-full mb-2" />
          <label>Monthly Report Cycle</label>
          <select value={settings.monthlyReportCycle || 'Calendar Month'} onChange={(e) => updateSetting('monthlyReportCycle', e.target.value)} className="border p-2 w-full mb-2">
            <option>Calendar Month</option><option>Fiscal Month</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.allowPlannersEdit || false} onChange={(e) => updateSetting('allowPlannersEdit', e.target.checked)} />
            Allow Planners to add/edit/delete activities
          </label>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Work Calendar</h2>
          {['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'].map(day => (
            <label key={day} className="flex items-center gap-2">
              <input type="checkbox" checked={(settings.workCalendar || []).includes(day)} onChange={(e) => {
                let newCal = [...(settings.workCalendar || [])];
                if (e.target.checked) newCal.push(day);
                else newCal = newCal.filter(d => d !== day);
                updateSetting('workCalendar', newCal);
              }} /> {day}
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
          <p>Current Expiry: {settings.licenseExpiry || '2026-07-01'}</p>
          <input type="date" value={settings.licenseExpiry || ''} onChange={(e) => updateSetting('licenseExpiry', e.target.value)} className="border p-1" />
          <button className="bg-green-600 text-white px-4 py-1 rounded ml-2">Extend License</button>
        </div>
      </div>
      <button onClick={handleSaveAll} className="mt-6 bg-blue-700 text-white px-6 py-2 rounded">SAVE ALL SETTINGS</button>
    </div>
  );
};

export default Settings;
