import { useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '@/types';

/**
 * Hook for managing authentication state and operations
 * Handles login, signup, logout, and token persistence
 * See: explanations/hooks/useAuth.md for detailed explanation
 * 
 * @param options - Optional configuration (baseUrl, storageKey)
 * @returns { user, isAuthenticated, isLoading, error, token, login, logout, signup, getAuthHeader }
 */
export function useAuth(options?: {
  baseUrl?: string;
  storageKey?: string;
}) {
  const baseUrl = options?.baseUrl || 'http://localhost:4000/api';
  const storageKey = options?.storageKey || 'kordiq_auth_token';

  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(storageKey);

        if (!token) {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }

        const response = await fetch(`${baseUrl}/auth/verify`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem(storageKey);
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }

        const user: User = await response.json();

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to verify session',
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const { token, user } = (await response.json()) as {
          token: string;
          user: User;
        };

        localStorage.setItem(storageKey, token);

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
        throw err;
      }
    },
    [baseUrl, storageKey]
  );

  const logout = useCallback(async () => {
    try {
      if (state.token) {
        await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
      }
    } finally {
      localStorage.removeItem(storageKey);
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [baseUrl, state.token, storageKey]);

  const signup = useCallback(
    async (email: string, password: string, name: string, role: 'teacher' | 'student') => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch(`${baseUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name, role }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }

        const { token, user } = (await response.json()) as {
          token: string;
          user: User;
        };

        localStorage.setItem(storageKey, token);

        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Signup failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
        throw err;
      }
    },
    [baseUrl, storageKey]
  );

  /**
   * Get Authorization header with Bearer token
   * Useful for including in API requests
   */
  const getAuthHeader = useCallback(() => {
    if (!state.token) return {};
    return {
      Authorization: `Bearer ${state.token}`,
    };
  }, [state.token]);

  return {
    ...state,
    login,
    logout,
    signup,
    getAuthHeader,
  };
}
