import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DailyEntry from './DailyEntry';
import ProgressMonitor from './ProgressMonitor';
import Activities from './Activities';
import Lookahead from './Lookahead';
import Reports from './Reports';
import Analytics from './Analytics';
import Audit from './Audit';
import Settings from './Settings';

function Dashboard({ token, user, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="flex">
      <Sidebar userRole={user?.role} onLogout={handleLogout} />
      <div className="flex-1 ml-64">
        <Header user={user} />
        <main className="p-6">
          <Routes>
            <Route path="daily" element={<DailyEntry token={token} user={user} />} />
            <Route path="progress" element={<ProgressMonitor token={token} user={user} />} />
            <Route path="activities" element={<Activities token={token} user={user} />} />
            <Route path="lookahead" element={<Lookahead token={token} user={user} />} />
            <Route path="reports" element={<Reports token={token} user={user} />} />
            <Route path="analytics" element={<Analytics token={token} user={user} />} />
            <Route path="audit" element={<Audit token={token} user={user} />} />
            <Route path="settings" element={<Settings token={token} user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;