import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';

function Lookahead({ user }) {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [plannedStart, setPlannedStart] = useState(new Date());
  const [plannedFinish, setPlannedFinish] = useState(new Date());
  const [priority, setPriority] = useState('Medium');
  const [constraint, setConstraint] = useState('');
  const [owner, setOwner] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchActivities();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/lookahead');
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async () => {
    if (!selectedActivity) {
      toast.error('Select an activity');
      return;
    }
    try {
      await api.post('/lookahead', {
        activity_code: selectedActivity,
        planned_start: plannedStart.toISOString().split('T')[0],
        planned_finish: plannedFinish.toISOString().split('T')[0],
        priority,
        constraint_text: constraint,
        owner
      });
      toast.success('Lookahead task added');
      fetchTasks();
      setSelectedActivity('');
      setPlannedStart(new Date());
      setPlannedFinish(new Date());
      setPriority('Medium');
      setConstraint('');
      setOwner('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add task');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📅 3-WEEK LOOKAHEAD PLANNING</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Activity</label>
            <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)} className="input">
              <option value="">Select Activity</option>
              {activities.map(act => (
                <option key={act.id} value={act.activity_code}>{act.activity_code} - {act.activity_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input">
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Planned Start</label>
            <DatePicker selected={plannedStart} onChange={date => setPlannedStart(date)} className="input" dateFormat="dd/MM/yyyy" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Planned Finish</label>
            <DatePicker selected={plannedFinish} onChange={date => setPlannedFinish(date)} className="input" dateFormat="dd/MM/yyyy" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Owner</label>
            <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Constraint</label>
            <input type="text" value={constraint} onChange={(e) => setConstraint(e.target.value)} className="input" />
          </div>
        </div>
        <button onClick={handleAddTask} className="btn-success">➕ ADD TASK</button>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📋 LOOKAHEAD TASKS</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead><tr className="bg-gray-100">
              <th className="px-4 py-2 border">Activity</th>
              <th className="px-4 py-2 border">Start</th>
              <th className="px-4 py-2 border">Finish</th>
              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Constraint</th>
              <th className="px-4 py-2 border">Owner</th>
              <th className="px-4 py-2 border">Status</th>
            </tr></thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="px-4 py-2 border">{task.activity_code}</td>
                  <td className="px-4 py-2 border">{task.planned_start}</td>
                  <td className="px-4 py-2 border">{task.planned_finish}</td>
                  <td className="px-4 py-2 border">{task.priority}</td>
                  <td className="px-4 py-2 border">{task.constraint_text}</td>
                  <td className="px-4 py-2 border">{task.owner}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                </tr>
              ))}
              {tasks.length === 0 && <tr><td colSpan="7" className="text-center py-4 text-gray-500">No lookahead tasks</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Lookahead;