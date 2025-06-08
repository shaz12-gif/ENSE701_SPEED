/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * Evidence Detail Page - Shows complete information about a piece of evidence and its source article.
 */

"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEvidence, getAverageRating, submitRating } from '@/services/api';
import ArticleCard from '@/components/data/ArticleCard';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Evidence, Article } from '@/types';

export default function EvidenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rating state
  const [rating, setRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Fetch evidence data
  useEffect(() => {
    const fetchEvidenceDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getEvidence({ _id: id });

        if (response.success && response.data) {
          const evidenceData = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

          if (!evidenceData) throw new Error('Evidence not found');
          setEvidence(evidenceData);

          // Normalize article data
          if (evidenceData.article) {
            setArticle({
              ...evidenceData.article,
              _id: evidenceData.article._id || evidenceData.articleId || 'unknown',
              year: evidenceData.article.year || evidenceData.year || new Date().getFullYear(),
              authors: evidenceData.article.authors || 'Unknown authors',
              journal: evidenceData.article.journal || evidenceData.source || 'Unknown journal'
            });
          } else if (evidenceData.articleId) {
            setArticle({
              _id: evidenceData.articleId,
              title: evidenceData.title || 'Untitled',
              year: evidenceData.year || new Date().getFullYear(),
              authors: evidenceData.authors || 'Unknown authors',
              journal: evidenceData.source || 'Unknown journal',
              createdAt: new Date().toISOString(),
              status: 'approved'
            });
          }

          // Fetch ratings
          const ratingResponse = await getAverageRating(id, 'evidence');
          if (ratingResponse.success) {
            setAverageRating(ratingResponse.data.averageRating || 0);
            setTotalRatings(ratingResponse.data.count || 0);
          }
        } else {
          throw new Error('Evidence not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load evidence details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidenceDetail();
  }, [id]);

  // Format result for display
  const formatResult = (result: string) => {
    switch (result) {
      case 'agree':
        return 'Supports Claim';
      case 'disagree':
        return 'Contradicts Claim';
      case 'mixed':
        return 'Mixed Results';
      default:
        return result || 'N/A';
    }
  };

  // Handle rating submit
  const handleRatingSubmit = async (newRating: number) => {
    setRating(newRating);
    setIsSubmittingRating(true);

    try {
      const response = await submitRating(id, 'evidence', newRating);

      if (response.success) {
        // Update average rating
        const ratingResponse = await getAverageRating(id, 'evidence');
        if (ratingResponse.success) {
          setAverageRating(ratingResponse.data.averageRating || 0);
          setTotalRatings(ratingResponse.data.count || 0);
        }
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Render star rating component
  interface StarRatingProps {
    value: number;
    onChange: (rating: number) => void;
    readonly?: boolean;
  }

  const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readonly = false }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          disabled={readonly || isSubmittingRating}
          className={`text-2xl ${
            readonly
              ? (star <= Math.round(value) ? 'text-yellow-400' : 'text-gray-300')
              : (star <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400')
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-lg">Loading evidence details...</p>
        </div>
      </div>
    );
  }

  if (error || !evidence) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/evidence" className="text-blue-500 hover:text-blue-700">
            ← Back to Evidence Database
          </Link>
        </div>
        <ErrorMessage message={error || 'Evidence not found'} />
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/evidence" className="text-blue-500 hover:text-blue-700">
          ← Back to Evidence Database
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">{String(evidence.title || 'Evidence Detail')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Evidence Information</h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Claim</h3>
              <p className="text-gray-800 p-3 bg-gray-50 rounded">{evidence.claim}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Result</h3>
                <p className={`font-bold ${
                  evidence.result === 'agree' ? 'text-green-600' :
                  evidence.result === 'disagree' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {formatResult(evidence.result)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Research Type</h3>
                <p>{evidence.typeOfResearch || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Participant Type</h3>
                <p>{evidence.participantType || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Practice</h3>
                <p>{evidence.practice?.name || evidence.practiceId}</p>
              </div>
            </div>

            {evidence.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{evidence.description}</p>
              </div>
            )}

            {evidence.analystComments && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Analyst Comments</h3>
                <p className="text-gray-700 italic whitespace-pre-line p-3 bg-gray-50 rounded border-l-4 border-blue-400">
                  {evidence.analystComments}
                </p>
              </div>
            )}

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Rate this Evidence</h3>

              <div className="flex items-center space-x-8">
                <StarRating value={rating} onChange={handleRatingSubmit} readonly={false} />

                <div className="text-sm text-gray-500">
                  {isSubmittingRating ? (
                    <span>Submitting...</span>
                  ) : rating > 0 ? (
                    <span>Thanks for rating!</span>
                  ) : (
                    <span>Click to rate</span>
                  )}
                </div>
              </div>

              {totalRatings > 0 && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <StarRating value={averageRating} readonly={true} onChange={() => {}} />
                  <span className="ml-2">
                    Average: {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Source Article</h2>

            {article ? (
              <ArticleCard article={article} />
            ) : (
              <p className="text-gray-500">Article information not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}