import { useEffect, useState } from 'react';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

/**
 * Hook for authenticating against the Flask API.
 * Stores the JWT token in localStorage and exposes helper
 * methods for registering, logging in and logging out.
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data.user as AuthUser);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: data.error || 'Registration failed' };
    }
    localStorage.setItem('token', data.token);
    setUser(data.user as AuthUser);
    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: data.error || 'Login failed' };
    }
    localStorage.setItem('token', data.token);
    setUser(data.user as AuthUser);
    return { data, error: null };
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, signUp, signIn, signOut };
};
