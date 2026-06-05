import React, { useEffect, useState } from 'react';
import api from '../api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function Analytics() {
  const [sCurveData, setSCurveData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const progressRes = await api.get('/progress/activities');
      const acts = progressRes.data;
      // For S-curve, we need daily cumulative data – backend not yet implemented, so placeholder
      setSCurveData([
        { date: 'Week 1', actual: 20, planned: 25 },
        { date: 'Week 2', actual: 45, planned: 50 },
        { date: 'Week 3', actual: 70, planned: 75 },
        { date: 'Week 4', actual: 90, planned: 100 },
      ]);
      const statusCount = { Completed: 0, 'On Track': 0, Delayed: 0, Critical: 0 };
      acts.forEach(act => {
        if (act.status.includes('Completed')) statusCount.Completed++;
        else if (act.status.includes('On Track')) statusCount['On Track']++;
        else if (act.status.includes('Delayed')) statusCount.Delayed++;
        else statusCount.Critical++;
      });
      setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));
    } catch (error) {
      console.error(error);
    }
  };

  const COLORS = ['#27ae60', '#4A90E2', '#e67e22', '#e74c3c'];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">📈 S-Curve Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sCurveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#4A90E2" name="Actual" />
            <Line type="monotone" dataKey="planned" stroke="#e67e22" name="Planned" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-primary mb-4">🥧 Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
              {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;