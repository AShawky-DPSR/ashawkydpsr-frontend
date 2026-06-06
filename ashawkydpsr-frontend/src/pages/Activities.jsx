import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/activities');
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const addActivity = async () => {
    if (!newActivity.trim()) return;
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newActivity }),
      });
      const saved = await response.json();
      setActivities([...activities, saved]);
      setNewActivity('');
    } catch (err) {
      console.error('Failed to add activity:', err);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      setActivities(activities.filter(act => act.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <div>Loading activities...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="Enter a new activity"
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={addActivity}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {activities.map(act => (
          <li key={act.id} className="flex justify-between items-center border p-2 rounded">
            <span>{act.name}</span>
            <button
              onClick={() => deleteActivity(act.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {activities.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No activities yet. Add one above.</p>
      )}
    </div>
  );
};

export default Activities;
