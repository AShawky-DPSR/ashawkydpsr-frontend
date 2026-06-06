import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import DailyEntry from './pages/DailyEntry';
import ProgressMonitor from './pages/ProgressMonitor';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Placeholder components (no separate files needed)
const Lookahead = () => <div className="p-6"><h1 className="text-2xl font-bold">Lookahead</h1><p>Coming soon</p></div>;
const Analytics = () => <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Coming soon</p></div>;
const AuditLog = () => <div className="p-6"><h1 className="text-2xl font-bold">Audit Log</h1><p>Coming soon</p></div>;

// License check from localStorage
const checkLicense = () => {
  const expiry = localStorage.getItem('licenseExpiry') || '2026-07-01';
  return new Date(expiry) > new Date();
};

function App() {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const users = JSON.parse(localStorage.getItem('appUsers')) || [
      { id: 1, username: 'admin', role: 'admin', password: 'admin123' },
      { id: 2, username: 'planner1', role: 'planner', password: 'planner123' },
      { id: 3, username: 'engineer1', role: 'engineer', password: 'eng123' }
    ];
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      const { password, ...userWithoutPass } = found;
      setUser(userWithoutPass);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!checkLicense()) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <div className="bg-white p-8 rounded shadow text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">License Expired</h1>
          <p>Please contact support to renew your license.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">RFC Planning System</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input type="text" name="username" className="w-full border p-2 rounded" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input type="password" name="password" className="w-full border p-2 rounded" required />
            </div>
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">Demo: admin/admin123, planner1/planner123, engineer1/eng123</p>
        </div>
      </div>
    );
  }

  const canAccessSettings = user.role === 'admin';

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-6">RFC System</h2>
          <nav>
            <ul className="space-y-2">
              <li><Link to="/daily" className="block py-2 px-3 rounded hover:bg-gray-700">Daily Entry</Link></li>
              <li><Link to="/progress" className="block py-2 px-3 rounded hover:bg-gray-700">Progress Monitor</Link></li>
              <li><Link to="/activities" className="block py-2 px-3 rounded hover:bg-gray-700">Activities</Link></li>
              <li><Link to="/lookahead" className="block py-2 px-3 rounded hover:bg-gray-700">Lookahead</Link></li>
              <li><Link to="/reports" className="block py-2 px-3 rounded hover:bg-gray-700">Reports</Link></li>
              <li><Link to="/analytics" className="block py-2 px-3 rounded hover:bg-gray-700">Analytics</Link></li>
              <li><Link to="/audit" className="block py-2 px-3 rounded hover:bg-gray-700">Audit Log</Link></li>
              {canAccessSettings && <li><Link to="/settings" className="block py-2 px-3 rounded hover:bg-gray-700">Settings</Link></li>}
              <li><button onClick={handleLogout} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-700 text-red-300">Logout</button></li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-4 bg-white">
          <Routes>
            <Route path="/daily" element={<DailyEntry />} />
            <Route path="/progress" element={<ProgressMonitor />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/lookahead" element={<Lookahead />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit" element={<AuditLog />} />
            {canAccessSettings && <Route path="/settings" element={<Settings />} />}
            <Route path="/" element={<Navigate to="/daily" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
