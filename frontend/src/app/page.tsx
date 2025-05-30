"use client";

import Link from 'next/link';
import './globals.css';

/**
 * HomePage component - Main landing page for SPEED application
 * Presents overview information and main navigation options
 */
export default function HomePage() {
  return (
    <main className="home-container">
      <section className="hero">
        <h1>SPEED</h1>
        <h2>Software Practice Empirical Evidence Database</h2>

        <div className="info-cards">
          <InfoCard 
            title="For Researchers" 
            text="Find empirical studies on the effectiveness of software development practices" 
          />
          <InfoCard 
            title="For Practitioners" 
            text="Discover practices supported by scientific evidence for your software projects" 
          />
          <InfoCard 
            title="For Educators" 
            text="Access research findings to inform teaching in software engineering" 
          />
        </div>

        <div className="cta-buttons">
          <Link href="/evidence/browse">
            <button>Browse Evidence</button>
          </Link>
          <Link href="/evidence/submit">
            <button className="secondary">Submit Evidence</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

/**
 * InfoCard component - Displays a card with title and text
 */
function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}