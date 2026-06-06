import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

function Settings({ user }) {
  const [editWindowHours, setEditWindowHours] = useState(24);
  const [monthlyCycle, setMonthlyCycle] = useState('calendar');
  const [monthlyStartDay, setMonthlyStartDay] = useState(1);
  const [allowPlannerEdit, setAllowPlannerEdit] = useState(false);
  const [workingDays, setWorkingDays] = useState({ sat: true, sun: true, mon: true, tue: true, wed: true, thu: true, fri: false });
  const [reportsFolder, setReportsFolder] = useState('');
  const [photosFolder, setPhotosFolder] = useState('');
  const [backupFolder, setBackupFolder] = useState('');
  const [backupFreq, setBackupFreq] = useState('on_submit');
  const [backupRetention, setBackupRetention] = useState(30);
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchSettings();
      fetchProjects();
      fetchLicense();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setEditWindowHours(res.data.edit_window_hours);
      setMonthlyCycle(res.data.monthly_report_cycle_type);
      setMonthlyStartDay(res.data.monthly_report_start_day);
      setAllowPlannerEdit(res.data.allow_planner_edit_activities);
      const wd = res.data.working_days || [0,1,2,3,4];
      setWorkingDays({
        sat: wd.includes(0), sun: wd.includes(1), mon: wd.includes(2), tue: wd.includes(3), wed: wd.includes(4), thu: wd.includes(5), fri: wd.includes(6)
      });
      setReportsFolder(res.data.reports_folder || '');
      setPhotosFolder(res.data.photos_base_folder || '');
      setBackupFolder(res.data.backup_folder || '');
      setBackupFreq(res.data.backup_frequency || 'on_submit');
      setBackupRetention(res.data.backup_retention || 30);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      if (res.data.length > 0) setSelectedProject(res.data[0].project_code);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLicense = async () => {
    try {
      const res = await api.get('/license/status');
      setLicenseExpiry(res.data.expiry);
    } catch (error) {
      console.error(error);
    }
  };

  const saveSettings = async () => {
    const workingDaysArray = [];
    if (workingDays.sat) workingDaysArray.push(0);
    if (workingDays.sun) workingDaysArray.push(1);
    if (workingDays.mon) workingDaysArray.push(2);
    if (workingDays.tue) workingDaysArray.push(3);
    if (workingDays.wed) workingDaysArray.push(4);
    if (workingDays.thu) workingDaysArray.push(5);
    if (workingDays.fri) workingDaysArray.push(6);
    try {
      await api.post('/settings', {
        edit_window_hours: editWindowHours,
        monthly_report_cycle_type: monthlyCycle,
        monthly_report_start_day: monthlyStartDay,
        allow_planner_edit_activities: allowPlannerEdit,
        working_days: workingDaysArray,
        reports_folder: reportsFolder,
        photos_base_folder: photosFolder,
        backup_folder: backupFolder,
        backup_frequency: backupFreq,
        backup_retention: backupRetention
      });
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const extendLicense = async () => {
    const newDate = prompt('Enter new expiry date (YYYY-MM-DD):', licenseExpiry);
    if (newDate) {
      try {
        await api.post('/license/extend', null, { params: { expiry_date: newDate } });
        toast.success('License extended');
        fetchLicense();
      } catch (error) {
        toast.error('Invalid date');
      }
    }
  };

  const addProject = async () => {
    const code = prompt('Project Code:');
    const name = prompt('Project Name:');
    if (code && name) {
      try {
        await api.post('/projects', { project_code: code, project_name: name, client_name: 'SE Saudi Energy', start_date: new Date().toISOString().split('T')[0], end_date: '2030-12-31', status: 'Active' });
        toast.success('Project added');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to add project');
      }
    }
  };

  const editProject = async () => {
    const proj = projects.find(p => p.project_code === selectedProject);
    if (!proj) return;
    const newName = prompt('New Project Name:', proj.project_name);
    if (newName) {
      try {
        await api.put(`/projects/${selectedProject}`, { ...proj, project_name: newName });
        toast.success('Project updated');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to update project');
      }
    }
  };

  const deleteProject = async () => {
    if (selectedProject === 'RFC-001') {
      toast.error('Cannot delete default project');
      return;
    }
    if (window.confirm(`Delete project ${selectedProject}?`)) {
      try {
        await api.delete(`/projects/${selectedProject}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      }
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
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">⚙️ Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">📊 Report Configuration</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Engineer Edit Window (hours)</label>
                <input type="number" value={editWindowHours} onChange={e => setEditWindowHours(e.target.value)} className="input w-32" />
              </div>
              <div>
                <label className="block text-sm font-medium">Monthly Report Cycle</label>
                <select value={monthlyCycle} onChange={e => setMonthlyCycle(e.target.value)} className="input w-48">
                  <option value="calendar">Calendar Month</option>
                  <option value="custom_day">Custom Start Day</option>
                </select>
              </div>
              {monthlyCycle === 'custom_day' && (
                <div>
                  <label className="block text-sm font-medium">Monthly Start Day (1-28)</label>
                  <input type="number" min="1" max="28" value={monthlyStartDay} onChange={e => setMonthlyStartDay(e.target.value)} className="input w-32" />
                </div>
              )}
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={allowPlannerEdit} onChange={e => setAllowPlannerEdit(e.target.checked)} />
                  Allow Planners to add/edit/delete activities
                </label>
              </div>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-2">📅 Work Calendar</h3>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center"><input type="checkbox" checked={workingDays.sat} onChange={e => setWorkingDays({...workingDays, sat: e.target.checked})} className="mr-1" /> Saturday</label>
              <label className="flex items-center"><input type="checkbox" checked={workingDays.sun} onChange={e => setWorkingDays({...workingDays, sun: e.target.checked})} className="mr-1" /> Sunday</label>
              <label className="flex items-center"><input type="checkbox" checked={workingDays.mon} onChange={e => setWorkingDays({...workingDays, mon: e.target.checked})} className="mr-1" /> Monday</label>
              <label className="flex items-center"><input type="checkbox" checked={workingDays.tue} onChange={e => setWorkingDays({...workingDays, tue: e.target.checked})} className="mr-1" /> Tuesday</label>
              <label className="flex items-center"><input type="checkbox" checked={workingDays.wed} onChange={e => setWorkingDays({...workingDays, wed: e.target.checked})} className="mr-1" /> Wednesday</label>
              <label className="flex items-center"><input type="checkbox" checked={workingDays.thu} onChange={e => setWorkingDays({...workingDays, thu: e.target.checked})} className="mr-1" /> Thursday</label>
              <label className="flex items-center"><input type="checkbox" checked={workingDays.fri} onChange={e => setWorkingDays({...workingDays, fri: e.target.checked})} className="mr-1" /> Friday</label>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-2">🔑 License Management</h3>
            <div>Current Expiry: {licenseExpiry || 'Unknown'}</div>
            <button onClick={extendLicense} className="btn-primary mt-2">📅 Extend License</button>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">📁 Project Management</h3>
            <div className="flex gap-2 mb-2">
              <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="input w-48">
                {projects.map(p => <option key={p.id} value={p.project_code}>{p.project_code} - {p.project_name}</option>)}
              </select>
              <button onClick={addProject} className="btn-success">➕ Add</button>
              <button onClick={editProject} className="btn-primary">✏️ Edit</button>
              <button onClick={deleteProject} className="btn-danger">🗑️ Delete</button>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-2">📂 File Paths</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Reports Folder</label>
                <input type="text" value={reportsFolder} onChange={e => setReportsFolder(e.target.value)} className="input w-full" placeholder="Server path" />
              </div>
              <div>
                <label className="block text-sm">Photos Base Folder</label>
                <input type="text" value={photosFolder} onChange={e => setPhotosFolder(e.target.value)} className="input w-full" placeholder="Server path" />
              </div>
              <div>
                <label className="block text-sm">Backup Folder</label>
                <input type="text" value={backupFolder} onChange={e => setBackupFolder(e.target.value)} className="input w-full" placeholder="Server path" />
              </div>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-2">💾 Backup Configuration</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Frequency</label>
                <select value={backupFreq} onChange={e => setBackupFreq(e.target.value)} className="input">
                  <option value="on_submit">On Submit</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm">Retention (number of backups)</label>
                <input type="number" value={backupRetention} onChange={e => setBackupRetention(e.target.value)} className="input w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={saveSettings} className="btn-primary">💾 SAVE ALL SETTINGS</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
