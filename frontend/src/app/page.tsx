"use client";

import Link from 'next/link';
import './globals.css';

export default function HomePage() {
  const cta_buttons = "cta-buttons";
  return (
    <main className="home-container">
      <section className="hero">
        <h1>SPEED</h1>
        <h2>Software Practice Empirical Evidence Database</h2>

        <div className="info-cards">
          <div>
            <h3>For Researchers</h3>
            <p>Find empirical studies on the effectiveness of software development practices</p>
          </div>
          <div>
            <h3>For Practitioners</h3>
            <p>Discover practices supported by scientific evidence for your software projects</p>
          </div>
          <div>
            <h3>For Educators</h3>
            <p>Access research findings to inform teaching in software engineering</p>
          </div>
        </div>

        <div className={cta_buttons}>
          <Link href="/practice"><button>Browse Practices</button></Link>
          <Link href="/submit"><button className="secondary">Submit Evidence</button></Link>
        </div>
      </section>
    </main>
  );
}