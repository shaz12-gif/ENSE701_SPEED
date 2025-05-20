"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const [practice, setPractice] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [practiceId, setPracticeId] = useState<number | null>(null);

  useEffect(() => {
    if (params?.id) {
      setPracticeId(parseInt(params.id as string));
    }
  }, [params]);

  useEffect(() => {
    if (practiceId === null) return;

    const fetchPracticeData = async () => {
      try {
        // Replace with real fetch later
        const samplePractices = [
          { id: 1, name: 'Test-Driven Development (TDD)', description: 'Writing tests before code to guide development.' },
          { id: 2, name: 'Continuous Integration', description: 'Frequently merging code changes to a shared repository.' },
          { id: 3, name: 'Pair Programming', description: 'Two programmers working together at one workstation.' },
          { id: 4, name: 'Agile Development', description: 'Iterative approach to software development.' },
          { id: 5, name: 'Code Reviews', description: 'Systematic examination of code by peers.' },
        ];

        const practice = samplePractices.find(p => p.id === practiceId);

        const sampleEvidence = [
          { id: 1, title: 'Study on TDD Effectiveness', authors: 'Smith et al.', year: 2022, summary: 'Found 25% reduction in defects when using TDD.' },
          { id: 2, title: 'Case Study: TDD in Enterprise', authors: 'Johnson and Brown', year: 2021, summary: 'Implementation of TDD in enterprise setting showed improved code quality.' }
        ];

        setPractice(practice);
        setEvidence(sampleEvidence);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPracticeData();
  }, [practiceId]);

  if (loading) return <div>Loading practice data...</div>;
  if (error) return <div>Error loading practice: {error}</div>;
  if (!practice) return <div>Practice not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{practice.name}</h1>
      <p className="text-lg mb-6">{practice.description}</p>

      <h2 className="text-2xl font-semibold mb-4">Evidence</h2>
      {evidence.length > 0 ? (
        <div className="grid gap-4">
          {evidence.map(item => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600">
                {item.authors} ({item.year})
              </p>
              <p className="mt-2">{item.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No evidence found for this practice.</p>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Submit New Evidence</h2>
        {/* Evidence submission form goes here */}
      </div>

      <div className="mt-8">
        <button
          onClick={() => router.push('/practices')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Practices
        </button>
      </div>
    </div>
  );
}
