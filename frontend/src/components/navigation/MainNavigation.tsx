"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Navigation link definition
 */
interface NavLink {
  href: string;
  label: string;
}

/**
 * MainNavigation component - Main navigation bar for the application
 * Provides links to primary sections of the application
 */
export default function MainNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  
  // Check authentication on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      const storedUsername = localStorage.getItem('username');
      
      setIsAuthenticated(authStatus);
      setUsername(storedUsername);
    };
    
    checkAuth();
    
    // Listen for storage events (for when user logs out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/');
  };
  
  // Define navigation links with updated paths
  const links: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/evidence/browse', label: 'Evidence' },
    { href: '/articles/submit', label: 'Submit Article' },
    { href: '/moderation/dashboard', label: 'Moderation' },
    { href: '/evidence/extract', label: 'Analysis' }
  ];
  
  return (
    <nav className="navbar">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">SPEED</Link>
        
        <div className="nav-links-container">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.href}
                className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {link.label}
              </Link>
            );
          })}
          
          {/* Login/logout link added inline */}
          {isAuthenticated ? (
            <div className="inline-flex items-center">
              <span className="nav-link nav-link-inactive">
                {username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="nav-link nav-link-inactive hover:text-red-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`nav-link ${pathname === '/login' ? 'nav-link-active' : 'nav-link-inactive'}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
