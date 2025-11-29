import { useEffect, useState } from 'react';

interface AdminAuthState {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
}

export function useAdminAuth() {
  const [auth, setAuth] = useState<AdminAuthState>({
    isAuthenticated: false,
    email: null,
    loading: true
  });

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      try {
        const data = JSON.parse(adminAuth);
        setAuth({
          isAuthenticated: true,
          email: data.email,
          loading: false
        });
      } catch {
        setAuth({ isAuthenticated: false, email: null, loading: false });
      }
    } else {
      setAuth({ isAuthenticated: false, email: null, loading: false });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('adminAuth');
    setAuth({ isAuthenticated: false, email: null, loading: false });
  };

  return { ...auth, logout };
}
