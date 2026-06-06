import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', role: 'engineer', password: '' });
  const [expiry, setExpiry] = useState('2026-07-01');

  useEffect(() => {
    const storedUsers = localStorage.getItem('appUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers([
        { id: 1, username: 'admin', role: 'admin', password: 'admin123' }
      ]);
    }
    setExpiry(localStorage.getItem('licenseExpiry') || '2026-07-01');
  }, []);

  const saveAll = () => {
    localStorage.setItem('appUsers', JSON.stringify(users));
    localStorage.setItem('licenseExpiry', expiry);
    alert('Settings saved');
  };

  const addUser = () => {
    if (!newUser.username) return;
    setUsers([...users, { id: Date.now(), ...newUser }]);
    setNewUser({ username: '', role: 'engineer', password: '' });
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="border p-1" />
            <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="border p-1">
              <option>admin</option><option>planner</option><option>engineer</option>
            </select>
            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="border p-1" />
            <button onClick={addUser} className="bg-blue-500 text-white px-2 rounded">Add</button>
          </div>
          <table className="w-full border">
            <thead className="bg-gray-50"><tr><th className="border p-1">User</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="border p-1">{u.username}</td>
                  <td className="border p-1">{u.role}</td>
                  <td className="border p-1"><button onClick={() => deleteUser(u.id)} className="text-red-500">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">License Management</h2>
          <p>Current Expiry: {expiry}</p>
          <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="border p-1" />
          <button onClick={saveAll} className="bg-blue-700 text-white px-4 py-1 rounded ml-2">Save All Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
