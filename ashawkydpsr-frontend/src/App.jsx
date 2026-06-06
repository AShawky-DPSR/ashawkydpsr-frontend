import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { checkLicense, login } from './services/mockData';
import DailyEntry from './pages/DailyEntry';
import ProgressMonitor from './pages/ProgressMonitor';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Simple placeholder for missing pages (you can create real ones later)
const Placeholder = ({ title }) => <div className="p-6"><h1 className="text-2xl">{title}</h1><p>Coming soon</p></div>;

function App() {
  const [licenseValid, setLicenseValid] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLicense().then(({ valid }) => setLicenseValid(valid));
    // For demo, auto-login as admin. Replace with real login form.
    login('admin', 'admin123').then(setUser).catch(() => setUser(null));
  }, []);

  if (licenseValid === null) return <div>Loading...</div>;
  if (!licenseValid) return (
    <div className="flex h-screen items-center justify-center bg-red-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-600">License Expired</h1>
        <p>Please contact support to renew your license.</p>
      </div>
    </div>
  );
  if (!user) return <div>Login form would go here (mock: use admin/admin123)</div>;

  const canAccessSettings = user.role === 'admin';

  return (
    <BrowserRouter>
      <div className="flex">
        <div className="w-64 bg-gray-800 text-white h-screen p-4">
          <h2 className="text-xl font-bold mb-4">RFC System</h2>
          <nav>
            <ul>
              <li><Link to="/daily" className="block py-2">Daily Entry</Link></li>
              <li><Link to="/progress" className="block py-2">Progress Monitor</Link></li>
              <li><Link to="/activities" className="block py-2">Activities</Link></li>
              <li><Link to="/lookahead" className="block py-2">Lookahead</Link></li>
              <li><Link to="/reports" className="block py-2">Reports</Link></li>
              <li><Link to="/analytics" className="block py-2">Analytics</Link></li>
              <li><Link to="/audit" className="block py-2">Audit Log</Link></li>
              {canAccessSettings && <li><Link to="/settings" className="block py-2">Settings</Link></li>}
              <li><button onClick={() => setUser(null)} className="block w-full text-left py-2 text-red-300">Logout</button></li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/daily" element={<DailyEntry />} />
            <Route path="/progress" element={<ProgressMonitor />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/lookahead" element={<Placeholder title="Lookahead" />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Placeholder title="Analytics" />} />
            <Route path="/audit" element={<Placeholder title="Audit Log" />} />
            {canAccessSettings && <Route path="/settings" element={<Settings />} />}
            <Route path="/" element={<Navigate to="/daily" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
