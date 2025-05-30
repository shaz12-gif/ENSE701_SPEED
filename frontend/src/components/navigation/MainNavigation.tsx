"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MainNavigation() {
  const pathname = usePathname();
  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/evidence/browse', label: 'Evidence Browse' },
    { href: '/articles/submit', label: 'Submit Article' },
    { href: '/evidence/extract', label: 'Evidence Extraction' },
    { href: '/moderation/dashboard', label: 'Moderation' },
    { href: '/practice', label: 'Practices' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname?.startsWith(path);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-40 bg-[#0b1625] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* App Title */}
          <Link href="/" className="font-bold text-2xl text-[#a8c0e0] tracking-wide flex-shrink-0 w-64">
            SPEED Database
          </Link>
          
          {/* Navigation Links Container - use flex-grow and explicit width */}
          <div className="flex-grow flex justify-start overflow-x-auto py-1" style={{columnGap: '20px'}}>
            <div className="nav-links-container">
              {navigationLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${active ? 'nav-link-active' : 'nav-link-inactive'}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
      {/* Spacer to prevent overlap with content */}
      <div className="h-[60px] w-full" />
    </header>
  );
}
