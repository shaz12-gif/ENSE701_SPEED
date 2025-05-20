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
      <body>
        <div className="container">
          <header className="header">
            <h1>SPEED Database</h1>
            <nav>
              <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/practices">Practices</Link></li>
                <li><Link href="/submit">Submit Evidence</Link></li>
              </ul>
            </nav>
          </header>
          <main>{children}</main>
          <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#666', borderTop: '1px solid #eaeaea', paddingTop: '1rem' }}>
            © {new Date().getFullYear()} SPEED Database
          </footer>
        </div>
      </body>
    </html>
  );
}