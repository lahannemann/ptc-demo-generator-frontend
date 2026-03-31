import { useEffect, useState, useCallback } from 'react';

export default function getTrackerChoiceFields(trackerId) {

  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchFields = useCallback(async (id = trackerId) => {
    if (!id) {
      setFields([]);
      setError(null);
      return;
    }

    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/get_reference_fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tracker_id: id }),
      });

      // Try to parse JSON; if it fails, throw a readable error
      let data;
      try {
        data = await res.json();
      } catch {
        const txt = await res.text();
        throw new Error(
          res.ok ? 'Unexpected server response.' : `Failed to fetch fields (${res.status}): ${txt || 'Unknown error'}`
        );
      }

      if (!res.ok) {
        throw new Error(data?.detail || 'Failed to fetch fields');
      }

      setFields(Array.isArray(data?.tracker_fields) ? data.tracker_fields : []);
    } catch (err) {
      console.error('useTrackerFields error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch fields'));
      setFields([]);
    } 
  }, [trackerId]);

  // Auto-load when trackerId changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchFields();
    })();
    return () => { cancelled = true; };
  }, [fetchFields]);

  // Expose a manual reload
  const reload = useCallback(() => fetchFields(), [fetchFields]);

  return { fields, error, reload };
}