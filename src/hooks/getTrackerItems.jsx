import { useEffect, useState, useCallback } from 'react';

export default function getTrackerItems(trackerId) {

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchItems = useCallback(async (id = trackerId) => {
    if (!id) {
      setItems([]);
      setError(null);
      return;
    }

    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/tracker_items`, {
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
          res.ok ? 'Unexpected server response.' : `Failed to fetch items (${res.status}): ${txt || 'Unknown error'}`
        );
      }

      if (!res.ok) {
        throw new Error(data?.detail || 'Failed to fetch items');
      }

      setItems(Array.isArray(data?.tracker_items) ? data.tracker_items : []);
    } catch (err) {
      console.error('useTrackerItems error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch items'));
      setItems([]);
    } 
  }, [trackerId]);

  // Auto-load when trackerId changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchItems();
    })();
    return () => { cancelled = true; };
  }, [fetchItems]);

  // Expose a manual reload
  const reload = useCallback(() => fetchItems(), [fetchItems]);

  return { items, error, reload };
}