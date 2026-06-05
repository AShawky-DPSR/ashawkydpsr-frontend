import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DailyEntry({ user }) {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [plannedQty, setPlannedQty] = useState(0);
  const [actualQty, setActualQty] = useState(0);
  const [manpower, setManpower] = useState(0);
  const [equipment, setEquipment] = useState('');
  const [material, setMaterial] = useState('');
  const [issues, setIssues] = useState('');
  const [nextDayPlan, setNextDayPlan] = useState('');
  const [photos, setPhotos] = useState([]);
  const [reportDate, setReportDate] = useState(new Date());
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [unit, setUnit] = useState('');

  useEffect(() => {
    fetchActivities();
    fetchRecentEntries();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (error) {
      toast.error('Failed to load activities');
    }
  };

  const fetchRecentEntries = async () => {
    try {
      const res = await api.get('/daily/recent');
      setRecentEntries(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivityChange = (e) => {
    const code = e.target.value;
    setSelectedActivity(code);
    const act = activities.find(a => a.activity_code === code);
    if (act) setUnit(act.unit);
  };

  const handlePhotoChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('report_date', reportDate.toISOString().split('T')[0]);
    formData.append('activity_code', selectedActivity);
    formData.append('planned_quantity', plannedQty);
    formData.append('actual_quantity', actualQty);
    formData.append('manpower', manpower);
    formData.append('equipment', equipment);
    formData.append('material', material);
    formData.append('issues', issues);
    formData.append('next_day_plan', nextDayPlan);
    for (let photo of photos) {
      formData.append('photos', photo);
    }

    try {
      const url = editingId ? `/daily/entry/${editingId}` : '/daily';
      const method = editingId ? 'put' : 'post';
      await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(editingId ? 'Report updated' : 'Report submitted');
      resetForm();
      fetchRecentEntries();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedActivity('');
    setPlannedQty(0);
    setActualQty(0);
    setManpower(0);
    setEquipment('');
    setMaterial('');
    setIssues('');
    setNextDayPlan('');
    setPhotos([]);
    setEditingId(null);
    setReportDate(new Date());
  };

  const handleEdit = async (entry) => {
    try {
      const res = await api.get(`/daily/entry/${entry.id}`);
      const data = res.data;
      setEditingId(entry.id);
      setReportDate(new Date(data.report_date));
      setSelectedActivity(data.activity_code);
      setPlannedQty(data.planned_quantity);
      setActualQty(data.actual_quantity);
      setManpower(data.manpower);
      setEquipment(data.equipment || '');
      setMaterial(data.material || '');
      setIssues(data.issues || '');
      setNextDayPlan(data.next_day_plan || '');
    } catch (error) {
      toast.error('Could not load entry for editing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/daily/entry/${id}`);
      toast.success('Deleted');
      fetchRecentEntries();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📋 DAILY PROGRESS REPORT</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <DatePicker
                selected={reportDate}
                onChange={date => setReportDate(date)}
                className="input"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Activity</label>
              <select
                value={selectedActivity}
                onChange={handleActivityChange}
                className="input"
                required
              >
                <option value="">Select Activity</option>
                {activities.map(act => (
                  <option key={act.id} value={act.activity_code}>
                    {act.activity_code} - {act.activity_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Planned Qty</label>
              <input
                type="number"
                value={plannedQty}
                onChange={e => setPlannedQty(parseFloat(e.target.value))}
                className="input"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Actual Qty</label>
              <input
                type="number"
                value={actualQty}
                onChange={e => setActualQty(parseFloat(e.target.value))}
                className="input"
                step="any"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">Unit: {unit || '—'}</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Manpower</label>
              <input
                type="number"
                value={manpower}
                onChange={e => setManpower(parseInt(e.target.value))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Equipment</label>
              <input
                type="text"
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input
              type="text"
              value={material}
              onChange={e => setMaterial(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Issues / Challenges</label>
            <textarea
              value={issues}
              onChange={e => setIssues(e.target.value)}
              rows="3"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Day Plan</label>
            <textarea
              value={nextDayPlan}
              onChange={e => setNextDayPlan(e.target.value)}
              rows="3"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Attach Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="input"
            />
            {photos.length > 0 && <p className="text-xs text-gray-500 mt-1">{photos.length} photo(s) selected</p>}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-success">
              {loading ? 'Processing...' : (editingId ? 'UPDATE' : 'SUBMIT')}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              CLEAR
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📋 RECENT ENTRIES</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Activity</th>
                <th className="px-4 py-2 border">Engineer</th>
                <th className="px-4 py-2 border">Planned</th>
                <th className="px-4 py-2 border">Actual</th>
                <th className="px-4 py-2 border">Unit</th>
                <th className="px-4 py-2 border">Cumulative</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{entry.report_date}</td>
                  <td className="px-4 py-2 border">{entry.activity_code}</td>
                  <td className="px-4 py-2 border">{entry.engineer_name}</td>
                  <td className="px-4 py-2 border">{entry.planned_quantity}</td>
                  <td className="px-4 py-2 border">{entry.actual_quantity}</td>
                  <td className="px-4 py-2 border">{entry.unit}</td>
                  <td className="px-4 py-2 border">{entry.cumulative_actual}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      entry.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      entry.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                      entry.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    <button onClick={() => handleEdit(entry)} className="text-blue-600 hover:text-blue-800">✏️</button>
                    {user?.role === 'Admin' && (
                      <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                    )}
                  </td>
                </tr>
              ))}
              {recentEntries.length === 0 && (
                <tr><td colSpan="9" className="text-center py-4 text-gray-500">No entries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DailyEntry;