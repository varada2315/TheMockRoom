import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { getToken, getStoredUser, apiClient, clearSession, UserProfile } from '@/lib/api-client';

interface ProtectedRouteProps {
  allowedRoles: ('superadmin' | 'mentor' | 'student')[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());

  useEffect(() => {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    apiClient
      .getMe()
      .then(res => {
        if (!res?.user || !allowedRoles.includes(res.user.role)) {
          redirectToLogin(res?.user?.role);
          return;
        }
        setUser(res.user);
        setLoading(false);
      })
      .catch(err => {
        console.error('Session validation failed:', err);
        clearSession();
        redirectToLogin();
      });
  }, []);

  const redirectToLogin = (_currentRole?: string) => {
    if (allowedRoles.includes('superadmin') && !allowedRoles.includes('mentor') && !allowedRoles.includes('student')) {
      setLocation('/portal-admin-x7k2/login');
    } else if (allowedRoles.includes('mentor')) {
      setLocation('/login/mentor');
    } else if (allowedRoles.includes('student')) {
      setLocation('/login/student');
    } else {
      setLocation('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-muted-foreground font-medium">Authenticating & loading dashboard...</p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <p className="text-sm text-muted-foreground mb-4">Access restricted. Redirecting to login...</p>
        <button
          onClick={() => redirectToLogin(user?.role)}
          className="text-xs text-primary underline font-medium"
        >
          Click here if not redirected automatically
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
