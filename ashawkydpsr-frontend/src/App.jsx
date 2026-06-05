import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/dashboard/*" element={
          token ? <Dashboard token={token} user={user} setToken={setToken} /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/dashboard/daily" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;