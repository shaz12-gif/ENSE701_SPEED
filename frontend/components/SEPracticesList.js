import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SEPracticesList = () => {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use sample data
    const samplePractices = [
      { id: 1, name: 'Test-Driven Development (TDD)', description: 'Writing tests before code to guide development.' },
      { id: 2, name: 'Continuous Integration', description: 'Frequently merging code changes to a shared repository.' },
      { id: 3, name: 'Pair Programming', description: 'Two programmers working together at one workstation.' },
      { id: 4, name: 'Agile Development', description: 'Iterative approach to software development.' },
      { id: 5, name: 'Code Reviews', description: 'Systematic examination of code by peers.' },
    ];
    
    // Simulate API fetch
    setTimeout(() => {
      setPractices(samplePractices);
      setLoading(false);
    }, 500);
    
    // In a real app, you would use:
    // fetch('/api/practices')
    //   .then(response => response.json())
    //   .then(data => {
    //     setPractices(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError(err.message);
    //     setLoading(false);
    //   });
  }, []);

  if (loading) return <div>Loading practices...</div>;
  if (error) return <div>Error loading practices: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Software Engineering Practices</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practices.map(practice => (
          <div key={practice.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{practice.name}</h3>
            <p className="text-gray-600 mb-4">{practice.description}</p>
            <Link href={`/practice/${practice.id}`} className="text-blue-600 hover:underline">
              View Evidence
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEPracticesList;