"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchEvidence, getPractices } from '@/services/api';
import EvidenceFilters from '@/components/evidence/EvidenceFilters';
import EvidenceTable from '@/components/evidence/EvidenceTable';
import EvidenceCards from '@/components/evidence/EvidenceCards';
// Import the shared SortableField type
import { Evidence, SortableField } from '@/types';

// Keep this interface since it's not in your types file yet
interface Practice {
  id: string;
  name: string;
}

/**
 * Evidence Browse Page
 * 
 * Allows users to search and browse all extracted evidence,
 * with filtering and sorting options.
 */
export default function EvidenceBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial filter values from URL if present
  const initialPracticeId = searchParams?.get('practice') || '';
  const initialClaim = searchParams?.get('claim') || '';
  const initialYear = searchParams?.get('year') || '';
  const initialResult = searchParams?.get('result') || '';
  
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [filters, setFilters] = useState({
    practiceId: initialPracticeId,
    claim: initialClaim,
    year: initialYear,
    result: initialResult as ('agree' | 'disagree' | 'mixed' | ''),
  });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  // Use the imported SortableField type here
  const [sortField, setSortField] = useState<SortableField>('claim');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch practices for filter options
  useEffect(() => {
    async function fetchPractices() {
      try {
        const result = await getPractices();
        
        if (result.success) {
          setPractices(result.data);
        }
      } catch (error) {
        console.error('Error fetching practices:', error);
      }
    }

    fetchPractices();
  }, []);

  // Function to update URL with filters
  const updateUrlWithFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.practiceId) params.set('practice', filters.practiceId);
    if (filters.claim) params.set('claim', filters.claim);
    if (filters.year) params.set('year', filters.year);
    if (filters.result) params.set('result', filters.result);
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/evidence/browse', { scroll: false });
  }, [filters, router]);

  // Fetch evidence based on filters
  useEffect(() => {
    async function fetchEvidence() {
      setLoading(true);
      setError(null);
      
      try {
        // Build query params
        const queryParams: Record<string, string> = {};
        
        if (filters.practiceId) queryParams.practiceId = filters.practiceId;
        if (filters.claim) queryParams.claim = filters.claim;
        if (filters.year) queryParams.year = filters.year;
        if (filters.result) queryParams.result = filters.result;
        
        const result = await searchEvidence(queryParams);
        
        if (result.success) {
          // Enhance evidence with practice names
          const enhancedEvidence = result.data.map((item: Evidence) => {
            const practice = practices.find(p => p.id === item.practiceId);
            return {
              ...item,
              practiceName: practice ? practice.name : 'Unknown Practice'
            };
          });
          
          setEvidence(enhancedEvidence);
        } else {
          throw new Error(result.message || 'Failed to fetch evidence');
        }
      } catch (error) {
        console.error('Error fetching evidence:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (practices.length > 0) {
      fetchEvidence();
    }
  }, [filters, practices]);

  // Update URL when filters change
  useEffect(() => {
    if (practices.length > 0) {
      updateUrlWithFilters();
    }
  }, [filters, practices, updateUrlWithFilters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Make sure this function uses the imported SortableField type
  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Create sorted evidence
  const getSortedEvidence = useCallback(() => {
    return [...evidence].sort((a, b) => {
      // Widen the type to allow any value, which we'll convert to string/number later
      let fieldValueA: unknown;
      let fieldValueB: unknown;

      switch (sortField) {
        case 'practice':
          fieldValueA = a.practiceName || '';
          fieldValueB = b.practiceName || '';
          break;
        case 'claim':
          fieldValueA = a.claim || '';
          fieldValueB = b.claim || '';
          break;
        case 'result':
          fieldValueA = a.result || '';
          fieldValueB = b.result || '';
          break;
        case 'year':
          fieldValueA = a.article?.year || 0;
          fieldValueB = b.article?.year || 0;
          break;
        case 'typeOfResearch':
          fieldValueA = a.typeOfResearch || '';
          fieldValueB = b.typeOfResearch || '';
          break;
        case 'participantType':
          fieldValueA = a.participantType || '';
          fieldValueB = b.participantType || '';
          break;
        default:
          fieldValueA = '';
          fieldValueB = '';
      }

      // Handle number comparisons
      if (typeof fieldValueA === 'number' && typeof fieldValueB === 'number') {
        return sortDirection === 'asc' ? fieldValueA - fieldValueB : fieldValueB - fieldValueA;
      }

      // Convert to strings for comparison (for all other types)
      const strA = String(fieldValueA).toLowerCase();
      const strB = String(fieldValueB).toLowerCase();

      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [evidence, sortField, sortDirection]);

  // Apply sorting to evidence (only when needed)
  const sortedEvidence = getSortedEvidence();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Evidence</h1>
      
      <EvidenceFilters 
        practices={practices}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="my-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {evidence.length} evidence records found
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Cards
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg">Loading evidence...</p>
        </div>
      ) : evidence.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No evidence records found. Try adjusting your filters.</p>
        </div>
      ) : viewMode === 'table' ? (
        <EvidenceTable 
          evidence={sortedEvidence} 
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(id) => router.push(`/evidence/${id}`)}
        />
      ) : (
        <EvidenceCards 
          evidence={sortedEvidence}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onCardClick={(id: any) => router.push(`/evidence/${id}`)}
        />
      )}
    </div>
  );
}