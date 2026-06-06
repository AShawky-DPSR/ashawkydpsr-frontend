import React, { useState, useEffect } from 'react';

const ProgressMonitor = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data – replace with your actual API call
    const fetchActivities = async () => {
      try {
        // Example data structure
        const data = [
          { id: 1, name: 'Design Review', assignee: 'Alice', dueDate: '2026-06-10', status: 'Completed' },
          { id: 2, name: 'Frontend Build', assignee: 'Bob', dueDate: '2026-06-12', status: 'In Progress' },
        ];
        setActivities(data);
      } catch (error) {
        console.error('Failed to load activities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading activities...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Progress Monitor</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border bg-gray-100">Activity</th>
              <th className="px-4 py-2 border bg-gray-100">Assignee</th>
              <th className="px-4 py-2 border bg-gray-100">Due Date</th>
              <th className="px-4 py-2 border bg-gray-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.id}>
                <td className="px-4 py-2 border">{act.name}</td>
                <td className="px-4 py-2 border">{act.assignee}</td>
                <td className="px-4 py-2 border">{act.dueDate}</td>
                <td className="px-4 py-2 border">{act.status}</td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No activities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressMonitor;
