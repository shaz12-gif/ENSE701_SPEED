import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainNavigation from '@/components/navigation/MainNavigation';

// Configure Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SPEED - Software Practice Empirical Evidence Database',
  description: 'A database of software engineering practices and empirical evidence',
};

/**
 * RootLayout component - Provides the base layout structure for all pages
 * Includes navigation, main content area, and footer
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="light-container">
          <div className="light light1"></div>
          <div className="light light2"></div>
        </div>
        
        {/* Navigation */}
        <MainNavigation />
        
        {/* Main Content with proper spacing */}
        <main className="min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}

/**
 * Footer component - Displays the site footer with copyright information
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0b1625] py-6">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-[#7a94b7] text-sm">
          © {currentYear} SPEED Database. All rights reserved.
        </p>
      </div>
    </footer>
  );
}