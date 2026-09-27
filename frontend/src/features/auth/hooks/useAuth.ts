import { useState, useEffect } from 'react';
import { AuthSession } from '@messmind/shared-types';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.getSession().then((sess) => {
      setSession(sess);
      setLoading(false);
    });
  }, []);

  const login = async (role: 'kitchen_manager' | 'logistics_volunteer' = 'kitchen_manager') => {
    const newSession = await authApi.mockLogin(role);
    setSession(newSession);
    return newSession;
  };

  const logout = async () => {
    await authApi.logout();
    setSession(null);
  };

  return { session, user: session?.user ?? null, loading, login, logout };
};
