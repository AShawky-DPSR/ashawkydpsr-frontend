import React, { useState, useEffect } from 'react';
import api from '../api';
import { Activity, TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react';

function ProgressMonitor() {
  const [activities, setActivities] = useState([]);
  const [disciplines, setDisciplines] = useState(['All']);
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [kpis, setKpis] = useState({ overall: 0, spi: 0, productivity: 0, onTrack: 0, delayed: 0 });

  useEffect(() => {
    fetchProgress();
  }, [selectedDiscipline]);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress/activities', {
        params: { discipline: selectedDiscipline !== 'All' ? selectedDiscipline : null }
      });
      setActivities(res.data);
      let totalProgress = 0;
      let totalWeight = 0;
      let onTrack = 0;
      let delayed = 0;
      res.data.forEach(act => {
        totalProgress += act.progress * act.total;
        totalWeight += act.total;
        if (act.status.includes('On Track') || act.status.includes('Completed')) onTrack++;
        else delayed++;
      });
      setKpis({
        overall: totalWeight > 0 ? (totalProgress / totalWeight).toFixed(1) : 0,
        spi: 1.02,
        productivity: 12.5,
        onTrack,
        delayed
      });
      const unique = [...new Set(res.data.map(a => a.discipline).filter(Boolean))];
      setDisciplines(['All', ...unique]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">OVERALL PROGRESS</p>
              <p className="text-2xl font-bold">{kpis.overall}%</p>
            </div>
            <Activity className="w-8 h-8 text-accent" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">SPI</p>
              <p className="text-2xl font-bold">{kpis.spi}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">PRODUCTIVITY</p>
              <p className="text-2xl font-bold">{kpis.productivity}</p>
            </div>
            <Users className="w-8 h-8 text-warning" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">ON-TRACK</p>
              <p className="text-2xl font-bold">{kpis.onTrack}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">DELAYED</p>
              <p className="text-2xl font-bold">{kpis.delayed}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
        </div>
      </div>

      {/* Discipline Filter */}
      <div className="card">
        <div className="flex gap-4 items-center">
          <label className="font-medium">Discipline:</label>
          <select
            value={selectedDiscipline}
            onChange={e => setSelectedDiscipline(e.target.value)}
            className="input w-48"
          >
            {disciplines.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Activity Progress Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📋 ACTIVITY PROGRESS</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Activity</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Discipline</th>
                <th className="px-4 py-2 border">Progress</th>
                <th className="px-4 py-2 border">Installed</th>
                <th className="px-4 py-2 border">Remaining</th>
                <th className="px-4 py-2 border">Planned Finish</th>
                <th className="px-4 py-2 border">Status</th>
              比
            </thead>
            <tbody>
              {activities.map(act => (
                <tr key={act.activity_code} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{act.activity_code}</td>
                  <td className="px-4 py-2 border">{act.activity_name}</td>
                  <td className="px-4 py-2 border">{act.discipline}</td>
                  <td className="px-4 py-2 border">{act.progress.toFixed(1)}%</td>
                  <td className="px-4 py-2 border">{act.installed.toFixed(1)} {act.unit}</td>
                  <td className="px-4 py-2 border">{act.remaining.toFixed(1)} {act.unit}</td>
                  <td className="px-4 py-2 border">{act.planned_finish || 'N/A'}</td>
                  <td className="px-4 py-2 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      act.status.includes('Completed') ? 'bg-green-100 text-green-800' :
                      act.status.includes('On Track') ? 'bg-blue-100 text-blue-800' :
                      act.status.includes('Delayed') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">No activities found<\/td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProgressMonitor;
