import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import DailyEntry from './pages/DailyEntry';
import ProgressMonitor from './pages/ProgressMonitor';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Lookahead from './pages/Lookahead';
import Analytics from './pages/Analytics';
import AuditLog from './pages/AuditLog';

function App() {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const users = JSON.parse(localStorage.getItem('appUsers')) || [
      { id: 1, username: 'admin', role: 'admin', password: 'admin123' }
    ];
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      const { password, ...rest } = found;
      setUser(rest);
      localStorage.setItem('currentUser', JSON.stringify(rest));
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const licenseOk = () => {
    const expiry = localStorage.getItem('licenseExpiry') || '2026-07-01';
    return new Date(expiry) > new Date();
  };

  if (!licenseOk()) {
    return <div className="p-8 text-center text-red-600 text-xl">License Expired – Contact Support</div>;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">RFC Planning System</h2>
          <form onSubmit={handleLogin}>
            <input type="text" name="username" placeholder="Username" className="w-full border p-2 mb-3 rounded" required />
            <input type="password" name="password" placeholder="Password" className="w-full border p-2 mb-3 rounded" required />
            {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">Demo: admin / admin123</p>
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
              <li><button onClick={logout} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-700 text-red-300">Logout</button></li>
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
