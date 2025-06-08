/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * Evidence Search & Browse Page - Allows users to search and explore evidence for software engineering practices.
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EvidenceTable from '@/components/evidence/EvidenceTable';
import { getEvidence } from '@/services/api';
import { Evidence, Practice, SortableField } from '@/types';

export default function EvidenceBrowsePage() {
  const router = useRouter();

  // State for evidence data
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering
  const [filters, setFilters] = useState({
    practiceId: '',
    claim: '',
    year: '',
    result: '',
    typeOfResearch: '',
    participantType: ''
  });

  // State for sorting
  const [sortField, setSortField] = useState<SortableField>('claim');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch practices for filter dropdown
  const [practices, setPractices] = useState<Practice[]>([]);

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const response = await fetch('/api/practices');
        if (!response.ok) throw new Error('Failed to fetch practices');
        const data = await response.json();
        setPractices(data.data || data);
      } catch (err) {
        console.error('Error fetching practices:', err);
      }
    };

    fetchPractices();
  }, []);

  // Fetch evidence based on filters
  useEffect(() => {
    const fetchEvidenceData = async () => {
      setIsLoading(true);

      try {
        // Filter out empty filter values
        const filterParams = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );

        const response = await getEvidence(filterParams);

        if (response.success) {
          setEvidence(response.data as Evidence[]);
        } else {
          throw new Error(response.message || 'Failed to fetch evidence');
        }
      } catch (err) {
        console.error('Error fetching evidence:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching evidence');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidenceData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      practiceId: '',
      claim: '',
      year: '',
      result: '',
      typeOfResearch: '',
      participantType: ''
    });
  };

  // Handle sorting
  const handleSort = (field: SortableField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    // Sort the evidence
    const sorted = [...evidence].sort((a, b) => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        const aParent = a[parentField];
        const bParent = b[parentField];
        if (!aParent || !bParent || typeof aParent !== 'object' || typeof bParent !== 'object') {
          return 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (aParent as Record<string, any>)[childField];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (bParent as Record<string, any>)[childField];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      } else {
        const aValue = a[field as keyof Evidence];
        const bValue = b[field as keyof Evidence];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortDirection === 'asc'
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0);
        }
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });

    setEvidence(sorted);
  };

  // Handle row click to navigate to detail page
  const handleRowClick = (id: string) => {
    router.push(`/evidence/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Evidence Database</h1>

      <div className="bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="practiceId" className="block text-sm font-medium mb-1">Practice</label>
            <select
              id="practiceId"
              name="practiceId"
              value={filters.practiceId}
              onChange={handleFilterChange}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="">All Practices</option>
              {practices.map(practice => (
                <option key={practice.id || practice._id} value={practice.id || practice._id}>
                  {practice.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="claim" className="block text-sm font-medium mb-1">Claim</label>
            <input
              type="text"
              id="claim"
              name="claim"
              value={filters.claim}
              onChange={handleFilterChange}
              placeholder="Search by claim..."
              className="w-full border rounded-md py-2 px-3"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-1">Publication Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              placeholder="e.g., 2023"
              className="w-full border rounded-md py-2 px-3"
            />
          </div>

          <div>
            <label htmlFor="result" className="block text-sm font-medium mb-1">Result</label>
            <select
              id="result"
              name="result"
              value={filters.result}
              onChange={handleFilterChange}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="">All Results</option>
              <option value="agree">Agree</option>
              <option value="disagree">Disagree</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label htmlFor="typeOfResearch" className="block text-sm font-medium mb-1">Research Type</label>
            <select
              id="typeOfResearch"
              name="typeOfResearch"
              value={filters.typeOfResearch}
              onChange={handleFilterChange}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="">All Types</option>
              <option value="case study">Case Study</option>
              <option value="experiment">Experiment</option>
              <option value="survey">Survey</option>
              <option value="literature review">Literature Review</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="participantType" className="block text-sm font-medium mb-1">Participant Type</label>
            <select
              id="participantType"
              name="participantType"
              value={filters.participantType}
              onChange={handleFilterChange}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="">All Participants</option>
              <option value="students">Students</option>
              <option value="professionals">Professionals</option>
              <option value="mixed">Mixed</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Found <span className="font-bold">{evidence.length}</span> results
        </p>
        <button
          onClick={() => router.push('/evidence/submit')}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700"
        >
          Submit New Evidence
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg">Loading evidence data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Try Again
          </button>
        </div>
      ) : (
        <EvidenceTable
          evidence={evidence}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}