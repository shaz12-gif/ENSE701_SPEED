import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainNavigation from '@/components/navigation/MainNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SPEED - Software Practice Empirical Evidence Database',
  description: 'A database of software engineering practices and empirical evidence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainNavigation />
        <main>
          {children}
        </main>
        <footer className="bg-gray-100 border-t mt-10 py-6">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-600 text-sm">
              © {new Date().getFullYear()} SPEED Database. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}