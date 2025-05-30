/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { getPendingArticles, approveArticle, rejectArticle } from '@/services/api';
import ArticleCard from '@/components/data/ArticleCard';

/**
 * Article interface for type safety
 */
interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  status: string;
  [key: string]: any; // For additional properties
}

/**
 * ModerationDashboardPage component - Displays articles pending moderation
 * and allows moderators to approve or reject submissions
 */
export default function ModerationDashboardPage() {
  // State variables
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  // Fetch pending articles on component mount
  useEffect(() => {
    fetchPendingArticles();
  }, []);

  /**
   * Fetches pending articles from API
   */
  const fetchPendingArticles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPendingArticles();
      
      if (response.success) {
        setArticles(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch articles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles article approval
   */
  const handleApproveArticle = async (article: Article): Promise<void> => {
    try {
      // Add article ID to processing state
      setProcessingIds(prev => [...prev, article._id]);
      
      // Hard-coded moderator ID for testing
      const moderatorId = 'moderator-123';
      
      // Approve with default note
      const result = await approveArticle(article._id, moderatorId, 'Approved after review');
      
      if (result.success) {
        // Remove from list on success
        setArticles(prevArticles => 
          prevArticles.filter(a => a._id !== article._id)
        );
      } else {
        throw new Error(result.message || 'Failed to approve article');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      // Remove from processing state
      setProcessingIds(prev => prev.filter(id => id !== article._id));
    }
  };

  /**
   * Handles article rejection
   */
  const handleRejectArticle = async (article: Article): Promise<void> => {
    try {
      // Add article ID to processing state
      setProcessingIds(prev => [...prev, article._id]);
      
      // Hard-coded moderator ID for testing
      const moderatorId = 'moderator-123';
      
      // Reject with default reason
      const result = await rejectArticle(
        article._id, 
        moderatorId, 
        'Does not meet publication standards'
      );
      
      if (result.success) {
        // Remove from list on success
        setArticles(prevArticles => 
          prevArticles.filter(a => a._id !== article._id)
        );
      } else {
        throw new Error(result.message || 'Failed to reject article');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      // Remove from processing state
      setProcessingIds(prev => prev.filter(id => id !== article._id));
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Article Moderation Dashboard</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Article Moderation Dashboard</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="font-bold ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Article list */}
      {articles.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No articles found waiting for moderation.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard 
              key={article._id} 
              article={article} 
              actions={[
                { 
                  label: processingIds.includes(article._id) ? 'Processing...' : 'Approve', 
                  onClick: () => handleApproveArticle(article),
                  disabled: processingIds.includes(article._id),
                  className: 'bg-green-600 hover:bg-green-700 disabled:bg-green-300' 
                },
                { 
                  label: processingIds.includes(article._id) ? 'Processing...' : 'Reject', 
                  onClick: () => handleRejectArticle(article),
                  disabled: processingIds.includes(article._id), 
                  className: 'bg-red-600 hover:bg-red-700 disabled:bg-red-300' 
                }
              ]} 
            />
          ))}
        </div>
      )}
    </div>
  );
}