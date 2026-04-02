/**
 * useProton — React hook wrapping the Proton SDK service.
 * Manages session state, auto-restores on mount, and exposes login/logout/transact.
 */
import { useState, useEffect, useCallback } from 'react';
import { login, logout, transact, ProtonSession } from '@/services/proton';

export function useProton() {
  const [session, setSession] = useState<ProtonSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Attempt to restore a previous session on mount
  useEffect(() => {
    login(true)
      .then((restored) => {
        if (restored) setSession(restored);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const result = await login(false);
      if (result) setSession(result);
      return result;
    } catch (err) {
      throw err;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    if (!session) return;
    await logout(session);
    setSession(null);
  }, [session]);

  const handleTransact = useCallback(
    async (
      actions: Array<{
        account: string;
        name: string;
        data: Record<string, any>;
      }>
    ) => {
      if (!session) throw new Error('Not logged in');
      return transact(session, actions);
    },
    [session]
  );

  return {
    session,
    actor: session?.auth.actor ?? null,
    loading,
    login: handleLogin,
    logout: handleLogout,
    transact: handleTransact,
    isLoggedIn: !!session,
  };
}
