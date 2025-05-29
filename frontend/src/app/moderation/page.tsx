"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Article {
  _id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  submittedBy: string;
  createdAt: string;
}

/**
 * Moderation Dashboard
 * 
 * This page allows moderators to review, approve, and reject submitted articles.
 * Only articles with "pending" status are shown for review.
 */
export default function ModerationDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  
  // Fetch pending articles
  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        const response = await fetch('/api/articles?status=pending');
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch pending articles');
        }
        
        setArticles(data.data);
      } catch (err) {
        console.error('Error fetching pending articles:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingArticles();
  }, []);
  
  // Handle article approval
  const handleApprove = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const response = await fetch(`/api/moderation/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moderatorId: 'current-moderator', // In a real app, this would be the logged-in user's ID
          notes: 'Approved after review'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to approve article ${id}`);
      }
      
      toast.success('Article approved successfully');
      
      // Remove the approved article from the list
      setArticles(prev => prev.filter(article => article._id !== id));
      
    } catch (err) {
      console.error('Error approving article:', err);
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setProcessingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };
  
  // Handle article rejection
  const handleReject = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const response = await fetch(`/api/moderation/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moderatorId: 'current-moderator', // In a real app, this would be the logged-in user's ID
          notes: 'Rejected after review'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to reject article ${id}`);
      }
      
      toast.success('Article rejected');
      
      // Remove the rejected article from the list
      setArticles(prev => prev.filter(article => article._id !== id));
      
    } catch (err) {
      console.error('Error rejecting article:', err);
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setProcessingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Moderation Dashboard</h1>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading pending articles...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Moderation Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Moderation Dashboard</h1>
        <Link 
          href="/articles" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium"
        >
          View All Articles
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <h2 className="font-medium text-lg">Articles Awaiting Moderation</h2>
          <p className="text-sm text-gray-600 mt-1">
            {articles.length === 0 ? 'No pending articles' : 
             `${articles.length} article${articles.length === 1 ? '' : 's'} waiting for review`}
          </p>
        </div>
        
        {articles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No articles waiting for review</p>
            <p className="text-sm mt-2">All submissions have been processed</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.map(article => (
              <div key={article._id} className="p-6 hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                <div className="text-sm text-gray-600">
                  <p>by {article.authors}</p>
                  <p>
                    {article.journal}, {article.year}
                    {article.volume && `, Volume ${article.volume}`}
                    {article.pages && `, Pages ${article.pages}`}
                  </p>
                  {article.doi && <p>DOI: {article.doi}</p>}
                </div>
                
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span>Submitted by {article.submittedBy || 'Anonymous'}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleApprove(article._id)}
                    disabled={processingIds.includes(article._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {processingIds.includes(article._id) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Approve'
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(article._id)}
                    disabled={processingIds.includes(article._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {processingIds.includes(article._id) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Reject'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800">Moderation Guidelines</h3>
        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>Verify that the article is a legitimate research paper from a reputable source</li>
          <li>Check that all required information is accurate and complete</li>
          <li>Ensure there are no duplicate submissions</li>
          <li>Reject submissions that are not related to software engineering practices</li>
        </ul>
      </div>
    </div>
  );
}