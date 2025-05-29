"use client";

import { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

/**
 * ProtectedRoute component
 * 
 * Wraps content that should only be accessible to authenticated users
 * For now, this is a placeholder that allows viewing without authentication
 * In a real implementation, this would check user authentication and redirect if unauthorized
 */
export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  // This is a simplified version without real authentication
  // In a real app, you would check if the user is authenticated
  
  const [isAuthorized, setIsAuthorized] = useState(true);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();
  
  // For demo purposes, let's add a UI element to simulate authentication state
  const [isSimulatingUnauthorized, setIsSimulatingUnauthorized] = useState(false);
  
  useEffect(() => {
    if (isSimulatingUnauthorized) {
      setIsAuthorized(false);
    }
  }, [isSimulatingUnauthorized]);
  
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
              onClick={() => setIsAuthorized(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Simulate Login
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              This is a protected page. 
              {adminOnly && " Administrator privileges required."}
              <button 
                onClick={() => setIsSimulatingUnauthorized(true)}
                className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
              >
                Simulate Unauthorized Access
              </button>
            </p>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}