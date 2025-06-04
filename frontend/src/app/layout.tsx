import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'SPEED Database - Software Engineering Evidence',
  description: 'A database of software engineering practices and evidence',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="light-container">
          <div className="light light1"></div>
          <div className="light light2"></div>
        </div>
        <nav className="navbar">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/practices">Practices</Link></li>
            <li><Link href="/submit">Submit Evidence</Link></li>
          </ul>
        </nav>
        {children}
        <footer className="footer">© 2025 SPEED Database</footer>
      </body>
    </html>
  );
}