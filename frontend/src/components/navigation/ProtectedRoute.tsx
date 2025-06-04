"use client";

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status from localStorage
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.push('/login');
      } else if (adminOnly && userRole !== 'admin') {
        // Admin-only route but user is not admin
        setIsAuthorized(false);
      } else {
        // User is authenticated and authorized
        setIsAuthorized(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router, adminOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <h2 className="text-lg font-bold mb-2">Unauthorized Access</h2>
          <p className="mb-4">
            You don&apos;t have permission to access this page.
            {adminOnly && " This page requires administrator privileges."}
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Home
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}