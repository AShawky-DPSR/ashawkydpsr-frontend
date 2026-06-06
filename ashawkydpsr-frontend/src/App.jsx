import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { checkLicense, login } from './services/mockData';
import DailyEntry from './pages/DailyEntry';
import ProgressMonitor from './pages/ProgressMonitor';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
// If you have these pages, import them; otherwise use placeholder
const Lookahead = () => <div className="p-6"><h1 className="text-2xl">Lookahead</h1><p>Coming soon</p></div>;
const Analytics = () => <div className="p-6"><h1 className="text-2xl">Analytics</h1><p>Coming soon</p></div>;
const AuditLog = () => <div className="p-6"><h1 className="text-2xl">Audit Log</h1><p>Coming soon</p></div>;

function App() {
  const [licenseValid, setLicenseValid] = useState(null);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    checkLicense().then(({ valid }) => setLicenseValid(valid));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      const loggedUser = await login(username, password);
      setUser(loggedUser);
      setLoginError('');
    } catch (err) {
      setLoginError('Invalid username or password');
    }
  };

  if (licenseValid === null) return <div className="p-4 text-center">Loading...</div>;
  if (!licenseValid) {
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
      <div className="flex min-h-screen">
        {/* Sidebar - keep exactly as you like */}
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
              <li><button onClick={() => setUser(null)} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-700 text-red-300">Logout</button></li>
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
