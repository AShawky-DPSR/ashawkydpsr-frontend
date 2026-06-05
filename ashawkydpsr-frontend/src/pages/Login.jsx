import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

function Login({ setToken, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const response = await api.post('/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const { access_token, role, user_id, full_name } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify({ username, role, user_id, full_name }));
      setToken(access_token);
      setUser({ username, role, user_id, full_name });
      toast.success('Login successful!');
      navigate('/dashboard/daily');
    } catch (error) {
      toast.error('🕵️ Wrong password! You are not the authorised engineer.\nPlease try again, or the system will call Eng. Ahmed Shawky.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-5xl">
            🏭
          </div>
          <h2 className="text-2xl font-bold text-primary mt-4">RFC PLANNING SYSTEM</h2>
          <p className="text-gray-500">AShawkyDPSR - Web Edition</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          Developed by Eng. Ahmed Shawky | ahmedshawkyqz@gmail.com | 📞 +201095214911
        </div>
      </div>
    </div>
  );
}

export default Login;