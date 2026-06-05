import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

function Settings({ user }) {
  const [editWindowHours, setEditWindowHours] = useState(24);
  const [monthlyCycle, setMonthlyCycle] = useState('calendar');
  const [monthlyStartDay, setMonthlyStartDay] = useState(1);
  const [allowPlannerEdit, setAllowPlannerEdit] = useState(false);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setEditWindowHours(res.data.edit_window_hours || 24);
      setMonthlyCycle(res.data.monthly_report_cycle_type || 'calendar');
      setMonthlyStartDay(res.data.monthly_report_start_day || 1);
      setAllowPlannerEdit(res.data.allow_planner_edit_activities || false);
    } catch (error) {
      console.error(error);
    }
  };

  const saveSettings = async () => {
    try {
      await api.post('/settings', {
        edit_window_hours: editWindowHours,
        monthly_report_cycle_type: monthlyCycle,
        monthly_report_start_day: monthlyStartDay,
        allow_planner_edit_activities: allowPlannerEdit
      });
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">User Information</h2>
        <p>Username: {user?.username}</p>
        <p>Role: {user?.role}</p>
        <p>Settings are only accessible by Administrator.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-primary mb-4">⚙️ Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Engineer Edit Window (hours)</label>
          <input type="number" value={editWindowHours} onChange={(e) => setEditWindowHours(e.target.value)} className="input w-32" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Report Cycle</label>
          <select value={monthlyCycle} onChange={(e) => setMonthlyCycle(e.target.value)} className="input w-48">
            <option value="calendar">Calendar Month</option>
            <option value="custom_day">Custom Start Day</option>
          </select>
        </div>
        {monthlyCycle === 'custom_day' && (
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Start Day (1-28)</label>
            <input type="number" min="1" max="28" value={monthlyStartDay} onChange={(e) => setMonthlyStartDay(e.target.value)} className="input w-32" />
          </div>
        )}
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={allowPlannerEdit} onChange={(e) => setAllowPlannerEdit(e.target.checked)} />
            Allow Planners to add/edit/delete activities
          </label>
        </div>
        <button onClick={saveSettings} className="btn-primary">💾 SAVE ALL SETTINGS</button>
      </div>
    </div>
  );
}

export default Settings;