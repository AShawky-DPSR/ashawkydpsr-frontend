import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar, Treemap, Sankey
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const Analytics = () => {
  const [dailyData, setDailyData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('dailyEntries') || '[]');
    const acts = JSON.parse(localStorage.getItem('activities') || '[]');
    const prog = JSON.parse(localStorage.getItem('progressItems') || '[]');
    setDailyData(entries);
    setActivities(acts);
    setProgress(prog);
  }, []);

  // Prepare chart datasets
  const barData = dailyData.map(d => ({ name: d.activity || 'Unknown', planned: d.plannedQty, actual: d.actualQty }));
  const lineData = dailyData.map((d, i) => ({ name: `Day ${i+1}`, actual: d.actualQty }));
  const areaData = dailyData.map((d, i) => ({ name: `Entry ${i+1}`, value: d.cumulative || 0 }));
  const pieData = activities.map(a => ({ name: a.name, value: a.baselineDailyQty || 0 }));
  const radarData = activities.map(a => ({ subject: a.name, A: a.baselineDailyQty || 0, B: 50 }));
  const scatterData = dailyData.map(d => ({ x: d.plannedQty, y: d.actualQty, z: d.manpower }));
  const radialData = activities.map((a, idx) => ({ name: a.name, uv: (a.baselineDailyQty || 0) % 100, fill: COLORS[idx % COLORS.length] }));
  const treemapData = activities.map(a => ({ name: a.name, size: a.baselineDailyQty || 10 }));
  const sankeyData = { nodes: [{name:'Planned'},{name:'Actual'},{name:'Gap'}], links: [{source:0,target:1,value:100},{source:1,target:2,value:20}] };
  const compositionData = dailyData.map(d => ({ name: d.activity || '?', planned: d.plannedQty, actual: d.actualQty }));
  const statusData = [
    { name: 'Completed', value: progress.filter(p => p.status === 'Completed').length },
    { name: 'In Progress', value: progress.filter(p => p.status === 'In Progress').length },
    { name: 'Not Started', value: progress.filter(p => p.status === 'Not Started').length },
    { name: 'Delayed', value: progress.filter(p => p.status === 'Delayed').length }
  ];
  const engineerData = dailyData.reduce((acc, d) => {
    acc[d.engineer] = (acc[d.engineer] || 0) + d.actualQty;
    return acc;
  }, {});
  const engineerChartData = Object.entries(engineerData).map(([name, value]) => ({ name, value }));
  const cumulativeData = dailyData.reduce((acc, d, idx) => {
    const prev = idx === 0 ? 0 : acc[idx-1].cumulative;
    acc.push({ name: `Day ${idx+1}`, cumulative: prev + d.actualQty });
    return acc;
  }, []);
  const weeklyData = dailyData.slice(-7).map((d,i) => ({ day: i+1, actual: d.actualQty }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Planned vs Actual by Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="planned" fill="#8884d8" /><Bar dataKey="actual" fill="#82ca9d" /></BarChart>
          </ResponsiveContainer>
        </div>
        {/* 2. Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Actual Progress Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="actual" stroke="#8884d8" /></LineChart>
          </ResponsiveContainer>
        </div>
        {/* 3. Area Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Cumulative Value Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" /></AreaChart>
          </ResponsiveContainer>
        </div>
        {/* 4. Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Baseline QTY Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label><Cell fill="#0088FE" /><Cell fill="#00C49F" /><Cell fill="#FFBB28" /><Cell fill="#FF8042" /></Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        {/* 5. Radar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Activity Baseline Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}><PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis /><Radar name="Baseline" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} /></RadarChart>
          </ResponsiveContainer>
        </div>
        {/* 6. Scatter Plot */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Planned vs Actual Scatter</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart><CartesianGrid /><XAxis dataKey="x" name="Planned" /><YAxis dataKey="y" name="Actual" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Scatter name="Entries" data={scatterData} fill="#8884d8" /></ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* 7. Radial Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Activity Completion % (Radial)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart data={radialData} innerRadius="20%" outerRadius="80%"><RadialBar dataKey="uv" /><Tooltip /></RadialBarChart>
          </ResponsiveContainer>
        </div>
        {/* 8. Treemap */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Baseline QTY Treemap</h2>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap data={treemapData} dataKey="size" ratio={4/3} stroke="#fff" fill="#8884d8" />
          </ResponsiveContainer>
        </div>
        {/* 9. Composed Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Planned, Actual & Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={compositionData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="planned" fill="#8884d8" /><Line dataKey="actual" stroke="#ff7300" /></ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* 10. Status Distribution Pie */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Progress Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label><Cell fill="#00C49F" /><Cell fill="#FFBB28" /><Cell fill="#8884d8" /><Cell fill="#FF8042" /></Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        {/* 11. Engineer Contribution Bar */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Actual QTY by Engineer</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engineerChartData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#82ca9d" /></BarChart>
          </ResponsiveContainer>
        </div>
        {/* 12. Cumulative Progress Line */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Cumulative Actual Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="cumulative" stroke="#8884d8" /></LineChart>
          </ResponsiveContainer>
        </div>
        {/* 13. Weekly Snapshot Bar */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Last 7 Days Actual</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}><CartesianGrid /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="actual" fill="#FF8042" /></BarChart>
          </ResponsiveContainer>
        </div>
        {/* 14. Gauge-like Radial (using RadialBar) */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Overall Progress Gauge</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" data={[{ name: 'Progress', uv: (dailyData.reduce((s,d)=>s+d.actualQty,0) / (dailyData.reduce((s,d)=>s+d.plannedQty,1)) * 100) || 0 }]}>
              <RadialBar dataKey="uv" fill="#8884d8" /><Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        {/* 15. Funnel / Sankey (simplified) */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Planned to Actual Flow</h2>
          <ResponsiveContainer width="100%" height={300}>
            <Sankey data={sankeyData} nodePadding={50}><Tooltip /></Sankey>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
