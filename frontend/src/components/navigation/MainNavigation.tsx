"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  
  // Define navigation links - Practices link removed as requested
  const links: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/evidence/browse', label: 'Evidence' },
    { href: '/articles/submit', label: 'Submit Article' }
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
        </div>
      </div>
    </nav>
  );
}
