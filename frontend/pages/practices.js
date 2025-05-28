import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { getAllPractices } from '../src/services/practicesAPI';
import SEPracticesList from '../src/components/SEPracticesList';

export default function PracticesPage() {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPractices() {
      try {
        const data = await getAllPractices();
        setPractices(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching practices:', err);
        setError('Failed to load practices');
        setLoading(false);
      }
    }

    fetchPractices();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Software Engineering Practices | SPEED</title>
        <meta name="description" content="Browse software engineering practices and their evidence" />
      </Head>

      <main className="main">
        <h1 className="title">Software Engineering Practices</h1>
        <p className="description">
          Browse the list of software engineering practices and their evidence
        </p>

        <div className="mt-8">
          {loading ? (
            <div className="text-center">
              <p>Loading practices...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error loading practices: {error}</p>
            </div>
          ) : (
            <SEPracticesList practices={practices} />
          )}
        </div>
      </main>

      <footer className="footer">
        <p>SPEED - Software Practice Evidence Database</p>
      </footer>
    </div>
  );
}