"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Evidence {
  id: string;
  title: string;
  source: string;
  year: number;
  description: string;
}

interface Practice {
  _id: string;
  name: string;
  description: string;
  evidences?: string[];
}

export default function PracticeDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [practice, setPractice] = useState<Practice | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPracticeDetail = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/practices/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Practice not found');
          }
          throw new Error(`Failed to fetch practice details: ${response.status}`);
        }

        const data = await response.json();
        const practiceData = data.data || data;
        setPractice(practiceData);

        const evidenceData: Evidence[] =
          practiceData.evidences?.map((evidence: string, index: number) => ({
            id: `evidence-${index + 1}`,
            title: `Evidence ${index + 1} for ${practiceData.name}`,
            source: "Research Journal",
            year: 2022 + index,
            description: evidence,
          })) || [];

        setEvidence(evidenceData);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching practice details:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPracticeDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Practice Details</h1>
        <div className="text-center py-8">
          <p className="text-lg">Loading practice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/practices" className="text-blue-500 hover:text-blue-700">
            ← Back to All Practices
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">Practice Details</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/practices" className="text-blue-500 hover:text-blue-700">
          ← Back to All Practices
        </Link>
      </div>

      {practice ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{practice.name}</h1>
          <p className="text-gray-600 mb-8">{practice.description}</p>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Evidence</h2>

            {evidence.length > 0 ? (
              <div className="space-y-6">
                {evidence.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.source} ({item.year})
                    </p>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded">
                <p className="text-gray-500">No evidence records found for this practice.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-red-600">Practice not found</p>
        </div>
      )}
    </div>
  );
}