import React, { useEffect, useState } from 'react';
import api from '../api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Area } from 'recharts';

function Analytics() {
  const [sCurveData, setSCurveData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [manpowerData, setManpowerData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [varianceData, setVarianceData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Progress activities for status and S-curve placeholder
      const progressRes = await api.get('/progress/activities');
      const acts = progressRes.data;
      const statusCount = { Completed: 0, 'On Track': 0, Delayed: 0, Critical: 0 };
      acts.forEach(act => {
        if (act.status.includes('Completed')) statusCount.Completed++;
        else if (act.status.includes('On Track')) statusCount['On Track']++;
        else if (act.status.includes('Delayed')) statusCount.Delayed++;
        else statusCount.Critical++;
      });
      setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));

      // For S-curve, we need daily cumulative – fetch from backend? We'll use mock for now, but ideally from API.
      // Simulate S-curve data (can be replaced with real data later)
      setSCurveData([
        { date: 'Week 1', actual: 20, planned: 25 },
        { date: 'Week 2', actual: 45, planned: 50 },
        { date: 'Week 3', actual: 70, planned: 75 },
        { date: 'Week 4', actual: 90, planned: 100 },
      ]);

      // Manpower over time – fetch from backend? For now mock
      setManpowerData([
        { date: '2026-06-01', manpower: 12 },
        { date: '2026-06-02', manpower: 15 },
        { date: '2026-06-03', manpower: 18 },
        { date: '2026-06-04', manpower: 20 },
        { date: '2026-06-05', manpower: 22 },
        { date: '2026-06-06', manpower: 25 },
      ]);

      // Productivity per activity (mock)
      setProductivityData(acts.map(act => ({ name: act.activity_code, productivity: Math.random() * 20 + 5 })));

      // Weekly planned vs actual (mock)
      setWeeklyData([
        { week: 'Week 1', planned: 100, actual: 80 },
        { week: 'Week 2', planned: 120, actual: 110 },
        { week: 'Week 3', planned: 140, actual: 135 },
        { week: 'Week 4', planned: 160, actual: 150 },
      ]);

      // Variance trend (mock)
      setVarianceData([
        { date: 'Week 1', variance: -5 },
        { date: 'Week 2', variance: -2 },
        { date: 'Week 3', variance: 1 },
        { date: 'Week 4', variance: 3 },
      ]);

      // Forecast chart
      const totalQty = acts.reduce((sum, a) => sum + a.total, 0);
      const installed = acts.reduce((sum, a) => sum + a.installed, 0);
      setForecastData([{ name: 'Installed', value: installed }, { name: 'Remaining', value: totalQty - installed }]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#27ae60', '#4A90E2', '#e67e22', '#e74c3c'];

  if (loading) return <div className="card">Loading charts...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. S-Curve */}
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

        {/* 2. Progress Gauge */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">📊 Overall Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'Progress', value: sCurveData[sCurveData.length-1]?.actual || 0 }]} layout="vertical">
              <XAxis type="number" domain={[0,100]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip />
              <Bar dataKey="value" fill="#27ae60" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-3xl font-bold mt-4">{sCurveData[sCurveData.length-1]?.actual || 0}%</p>
        </div>

        {/* 3. Resource Histogram (Manpower per activity) */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">👷 Resource Histogram</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="productivity" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Trend Line (Daily Production) */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">📉 Daily Production Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={manpowerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="manpower" stroke="#e67e22" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Status Distribution (Pie) */}
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

        {/* 6. Forecast Chart */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">🔮 Completion Forecast</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecastData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7. Manpower over time (Line) */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">👥 Manpower Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={manpowerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="manpower" stroke="#27ae60" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 8. Planned vs Actual Weekly */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">📊 Planned vs Actual (Weekly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="planned" fill="#e67e22" />
              <Bar dataKey="actual" fill="#27ae60" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 9. Variance Trend */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">📉 Variance Trend (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={varianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="variance" stroke="#e74c3c" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 10. Productivity per Activity (Bar) */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">⚙ Productivity per Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="productivity" fill="#4A90E2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
