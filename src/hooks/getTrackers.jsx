import { useEffect, useState } from 'react';

export default function getTrackers(selectedProject) {
  const [trackerOptions, setTrackerOptions] = useState([]);
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!selectedProject) {
      setTrackerOptions([]);
      return;
    }

    let alive = true;

    async function fetchTrackers() {
      setError('');

      try {
        const res = await fetch(`${API_BASE_URL}/api/trackers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ project_name: selectedProject }),
        });

        let data = null;
        try { data = await res.json(); } catch {}

        if (!res.ok) {
          throw new Error(data?.detail || 'Failed to fetch trackers');
        }

        if (alive) {
          setTrackerOptions(data.trackers || []);
        }

      } catch (err) {
        if (alive) setError(err.message);
      }
    }

    fetchTrackers();

    return () => { alive = false };
  }, [selectedProject]);

  return { trackerOptions, error };
}
