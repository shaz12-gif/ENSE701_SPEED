"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

/**
 * MainNavigation component
 * 
 * Provides consistent navigation across all pages of the SPEED application
 * Highlights the current active page and provides accessibility features
 */
export default function MainNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation links configuration
  const navigationLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/evidence/browse', label: 'Evidence Browse', icon: '🔍' },
    { href: '/articles/submit', label: 'Submit Article', icon: '📝' },
    { href: '/evidence/extract', label: 'Evidence Extraction', icon: '📊', protected: true },
    { href: '/moderation/dashboard', label: 'Moderation', icon: '👮', protected: true, admin: true },
    { href: '/practice', label: 'Practices', icon: '📚' },
  ];
  
  // Check if a link is active (current page)
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname?.startsWith(path);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 mr-1">SPEED</span>
              <span className="text-gray-600 hidden md:inline">Database</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center
                  ${isActive(link.href) 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${link.protected ? 'border-l-2 border-blue-200' : ''}
                  ${link.admin ? 'border-l-2 border-blue-400' : ''}
                `}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                <span className="mr-1" aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
                  ${isActive(link.href) 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2" aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}