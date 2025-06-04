"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const storedUsername = localStorage.getItem('username');
    
    setIsAuthenticated(authStatus);
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    // Redirect to home page
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-white">Welcome, {username || 'User'}</span>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
      >
        Logout
      </button>
    </div>
  );
}