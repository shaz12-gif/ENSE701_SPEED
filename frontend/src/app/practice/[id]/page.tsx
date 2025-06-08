/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * Practice Evidence Page - Shows all evidence submitted for a specific software engineering practice.
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Evidence } from '@/types';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const response = await fetch(`/api/upload/practice/${params?.id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch evidence');
        }
        const data = await response.json();
        setEvidence(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch evidence');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchEvidence();
    }
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-lg text-gray-600">
        Loading evidence...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Evidence for Practice {params?.id}</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Submitted Evidence</h2>
        {evidence.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {evidence.map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow p-4 border">
                <h3 className="font-semibold text-lg mb-1">{String(item.title)}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {String(item.source)} ({String(item.year)})
                </p>
                <p className="mb-2">{item.description}</p>
                {item.filename && (
                  <a
                    href={`/api/upload/${item._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No evidence found for this practice.</p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/submit')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit New Evidence
        </button>
        <button
          onClick={() => router.push('/practices')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Practices
        </button>
      </div>
    </div>
  );
}
