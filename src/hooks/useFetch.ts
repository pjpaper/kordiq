import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Generic hook for fetching data from any API endpoint
 * Manages loading, error, and data states automatically
 * Supports cancellation via AbortController
 * See: explanations/hooks/useFetch.md for detailed explanation
 * 
 * @param url - API endpoint to fetch (null = don't fetch yet)
 * @param options - HTTP options (method, headers, body)
 * @returns { status, data, error, refetch }
 */
export function useFetch<T>(
  url: string | null,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const fetchOptions: RequestInit = {
        method: options?.method || 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      };

      if (options?.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || 'Failed to fetch'}`
        );
      }

      const json = (await response.json()) as T;

      if (controller.signal.aborted) {
        return;
      }

      setData(json);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    executeFetch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, executeFetch]);

  return {
    status: loading ? 'loading' : error ? 'error' : data !== null ? 'success' : 'idle',
    data,
    error,
    refetch: executeFetch,
  };
}
