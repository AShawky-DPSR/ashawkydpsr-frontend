import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

function Activities({ user }) {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    activity_code: '',
    activity_name: '',
    discipline: '',
    total_quantity: 0,
    unit: '',
    baseline_daily_qty: 0,
    critical: 0,
    planned_start: '',
    planned_finish: ''
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (error) {
      toast.error('Failed to load activities');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api.put(`/activities/${editing}`, formData);
        toast.success('Activity updated');
      } else {
        await api.post('/activities', formData);
        toast.success('Activity created');
      }
      setShowModal(false);
      setEditing(null);
      setFormData({
        activity_code: '', activity_name: '', discipline: '', total_quantity: 0, unit: '',
        baseline_daily_qty: 0, critical: 0, planned_start: '', planned_finish: ''
      });
      fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleEdit = (act) => {
    setEditing(act.activity_code);
    setFormData({
      activity_code: act.activity_code,
      activity_name: act.activity_name,
      discipline: act.discipline,
      total_quantity: act.total_quantity,
      unit: act.unit,
      baseline_daily_qty: act.baseline_daily_qty || 0,
      critical: act.critical || 0,
      planned_start: act.planned_start || '',
      planned_finish: act.planned_finish || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (code) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await api.delete(`/activities/${code}`);
      toast.success('Deleted');
      fetchActivities();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const canEdit = user?.role === 'Admin' || (user?.role === 'Planner' && true);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">🏗 Activities</h1>
        {canEdit && (
          <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-success flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Activity</th>
              <th className="px-4 py-2 border">Discipline</th>
              <th className="px-4 py-2 border">Qty</th>
              <th className="px-4 py-2 border">Unit</th>
              <th className="px-4 py-2 border">Baseline Daily</th>
              <th className="px-4 py-2 border">Critical</th>
              <th className="px-4 py-2 border">Planned Start</th>
              <th className="px-4 py-2 border">Planned Finish</th>
              {canEdit && <th className="px-4 py-2 border">Actions</th>}
            比
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{act.activity_code}</td>
                <td className="px-4 py-2 border">{act.activity_name}</td>
                <td className="px-4 py-2 border">{act.discipline}</td>
                <td className="px-4 py-2 border">{act.total_quantity}</td>
                <td className="px-4 py-2 border">{act.unit}</td>
                <td className="px-4 py-2 border">{act.baseline_daily_qty}</td>
                <td className="px-4 py-2 border">{act.critical ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{act.planned_start || '-'}</td>
                <td className="px-4 py-2 border">{act.planned_finish || '-'}</td>
                {canEdit && (
                  <td className="px-4 py-2 border space-x-2">
                    <button onClick={() => handleEdit(act)} className="text-blue-600 hover:text-blue-800"><Edit2 className="w-4 h-4 inline" /></button>
                    <button onClick={() => handleDelete(act.activity_code)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Activity' : 'Add Activity'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Activity Code</label>
                <input name="activity_code" value={formData.activity_code} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Activity Name</label>
                <input name="activity_name" value={formData.activity_name} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discipline</label>
                <input name="discipline" value={formData.discipline} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Quantity</label>
                <input name="total_quantity" type="number" value={formData.total_quantity} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <input name="unit" value={formData.unit} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Baseline Daily Qty</label>
                <input name="baseline_daily_qty" type="number" value={formData.baseline_daily_qty} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Critical</label>
                <select name="critical" value={formData.critical} onChange={handleChange} className="input">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Planned Start</label>
                <input name="planned_start" type="date" value={formData.planned_start} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Planned Finish</label>
                <input name="planned_finish" type="date" value={formData.planned_finish} onChange={handleChange} className="input" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
              <button onClick={handleSubmit} className="btn-success">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;
