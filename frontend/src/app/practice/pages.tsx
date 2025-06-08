/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Practices Page
 * Lists all software engineering practices and links to their evidence.
 * Author: Andrew Koves
 * ID: 20126313
 */

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// If you have a Practice type in @/types, import it instead of defining here
interface Practice {
  id: string;
  name: string;
  description: string;
  evidences?: string[];
  evidenceCount?: number;
}

export default function PracticesPage() {
  const [practiceList, setPracticeList] = useState<Practice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPracticeList = async () => {
      try {
        const response = await fetch('/api/practices');
        if (!response.ok) {
          throw new Error(`Failed to fetch practices: ${response.status}`);
        }
        const result = await response.json();
        const data = result.data || result;
        const normalized = data.map((practice: any) => ({
          id: practice._id,
          name: practice.name,
          description: practice.description,
          evidences: practice.evidences,
          evidenceCount: practice.evidenceCount,
        }));
        setPracticeList(normalized);
      } catch (err) {
        console.error('Error fetching practices:', err);
        setFetchError('Failed to load practices. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPracticeList();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Software Engineering Practices</h1>
        <div className="text-center py-8">
          <p className="text-lg">Loading practices...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Software Engineering Practices</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{fetchError}</p>
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
      <h1 className="text-2xl font-bold mb-6">Software Engineering Practices</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {practiceList.map((practice) => (
          <div
            key={practice.id}
            className="border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{practice.name}</h2>
            <p className="text-gray-600 mb-4">{practice.description}</p>
            <Link
              href={`/practices/${practice.id}`}
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Evidence
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/submit"
          className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit New Evidence
        </Link>
      </div>
    </div>
  );
}