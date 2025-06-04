/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './practice.module.css';

interface Evidence {
  _id: string;
  practiceId: string;
  title: string;
  source: string;
  year: number;
  description: string;
  filename?: string;
}

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        console.log('Fetching evidence for practice:', params?.id);
        const response = await fetch(`http://localhost:3001/api/upload/practice/${params?.id}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch evidence');
        }

        const data = await response.json();
        console.log('Fetched evidence:', data);
        setEvidence(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch evidence');
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchEvidence();
    }
  }, [params]);

  if (loading) return <div className={styles.loadingState}>Loading evidence...</div>;
  if (error) return <div className={styles.errorState}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Evidence for Practice {params?.id}</h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Submitted Evidence</h2>
        {evidence.length > 0 ? (
          <div className={styles.evidenceGrid}>
            {evidence.map(item => (
              <div key={item._id} className={styles.evidenceCard}>
                <h3 className={styles.evidenceTitle}>{item.title}</h3>
                <p className={styles.evidenceMeta}>
                  {item.source} ({item.year})
                </p>
                <p className={styles.evidenceSummary}>{item.description}</p>
                {item.filename && (
                  <a 
                    href={`http://localhost:3001/api/upload/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fileLink}
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No evidence found for this practice.</p>
        )}
      </div>

      <button
        onClick={() => router.push('/submit')}
        className={styles.submitButton}
      >
        Submit New Evidence
      </button>

      <button
        onClick={() => router.push('/practices')}
        className={styles.backButton}
      >
        Back to Practices
      </button>
    </div>
  );
}
