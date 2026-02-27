import { useState, useCallback, useRef } from 'react';

/**
 * Generic hook for fetching lists of admin data.
 * Eliminates repeated loading / error / data boilerplate.
 */
export function useAdminData(fetchFn) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fnRef = useRef(fetchFn);
  fnRef.current = fetchFn;

  const load = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    try {
      const result = await fnRef.current(...args);
      const items = Array.isArray(result)
        ? result
        : result?.items ?? result?.rows ?? [];
      setData(items);
      return items;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData([]);
    setError('');
  }, []);

  return { data, loading, error, load, reset, setData };
}

/**
 * Hook for single async actions (create / update / delete).
 */
export function useAdminAction(actionFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fnRef = useRef(actionFn);
  fnRef.current = actionFn;

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const result = await fnRef.current(...args);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || 'Action failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError('');
    setSuccess(false);
  }, []);

  return { execute, loading, error, success, resetState };
}
