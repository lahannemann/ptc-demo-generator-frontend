import { useEffect, useState } from 'react';

export default function getProjects(enabled) {
  const [projectNames, setProjectNames] = useState([]);
  const [error, setError]       = useState('');

  // Read API base once here so every page doesn’t need to
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!enabled) return;         // wait until session is ready or feature is enabled
    let alive = true;             // prevents state updates after unmount

    async function fetchProjectNames() {
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/project_names`, {
          method: 'GET',
          credentials: 'include', // send session cookie
        });

        // Try to parse JSON whether or not res.ok (helps capture server error details)
        let data = null;
        try { data = await res.json(); } catch { /* ignore parse errors */ }

        if (!res.ok) {
          const msg = data?.detail || 'Failed to fetch project names';
          throw new Error(msg);
        }

        if (alive) setProjectNames(data?.project_names || []);
      } catch (err) {
        if (alive) setError(err.message || 'Failed to fetch project names');
      }
    }

    fetchProjectNames();
    return () => { alive = false; };
  }, [enabled, API_BASE_URL]);

  // Optional: allow consumers to refresh explicitly
  const refresh = async () => {
    const res = await fetch(`${API_BASE_URL}/api/project_names`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    setProjectNames(data?.project_names || []);
  };

  return { projectNames, error, refresh };
}
