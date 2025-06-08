/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * Login Page - Allows users to log in as admin or analyst for restricted features.
 */

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  AUTH_STORAGE_KEY, 
  USER_ROLE_STORAGE_KEY, 
  USERNAME_STORAGE_KEY,
  DEMO_CREDENTIALS 
} from '@/config';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check admin credentials
      if (formData.username === DEMO_CREDENTIALS.admin.username && 
          formData.password === DEMO_CREDENTIALS.admin.password) {
        
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(USER_ROLE_STORAGE_KEY, DEMO_CREDENTIALS.admin.role);
        localStorage.setItem(USERNAME_STORAGE_KEY, formData.username);
        router.push('/moderation/dashboard');
        
      // Check analyst credentials
      } else if (formData.username === DEMO_CREDENTIALS.analyst.username && 
                formData.password === DEMO_CREDENTIALS.analyst.password) {
        
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(USER_ROLE_STORAGE_KEY, DEMO_CREDENTIALS.analyst.role);
        localStorage.setItem(USERNAME_STORAGE_KEY, formData.username);
        router.push('/evidence/extract');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f1c2f] to-[#0b1625]">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">SPEED</h1>
          <p className="text-gray-600">Login to access restricted features</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo Credentials:</p>
          <p className="mt-1">Admin: admin / password123</p>
          <p>Analyst: analyst / password123</p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}