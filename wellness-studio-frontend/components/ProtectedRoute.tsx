'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'Admin' | 'Client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      
      if (!userId || !role) {
        // Redirect to login if no user data found
        router.push('/login');
        return;
      }

      if (role !== requiredRole) {
        // If the role doesn't match, redirect based on user role
        router.push(role === 'Admin' ? '/admin' : '/client');
        return;
      }

      // If role matches, allow access
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
