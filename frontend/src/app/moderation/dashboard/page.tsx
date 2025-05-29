/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/data/ArticleCard';
import ModerationDialog from '@/components/moderation/ModerationDialog';
import { getArticles, approveArticle, rejectArticle } from '@/services/api';
import { Article } from '@/types';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';

/**
 * Moderation Dashboard Page
 * Protected page for moderators to review and approve/reject submitted articles
 */
export default function ModerationDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending articles
  useEffect(() => {
    const fetchPendingArticles = async () => {
      try {
        setLoading(true);
        const response = await getArticles({ status: 'pending' });
        
        if (response.success) {
          setArticles(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch articles');
        }
      } catch (err) {
        console.error('Error fetching pending articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingArticles();
  }, []);

  const handleApproveClick = (article: Article) => {
    setSelectedArticle(article);
    setModerationAction('approve');
    setNotes('');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRejectClick = (article: Article) => {
    setSelectedArticle(article);
    setModerationAction('reject');
    setNotes('');
  };

  const handleConfirmModeration = async () => {
    if (!selectedArticle || !moderationAction) return;
    
    setIsProcessing(true);
    
    try {
      const moderatorId = 'current-moderator'; // In a real app, get from auth context
      const articleId = selectedArticle._id;
      
      let response;
      if (moderationAction === 'approve') {
        response = await approveArticle(articleId, moderatorId, notes);
      } else {
        response = await rejectArticle(articleId, moderatorId, notes);
      }
      
      if (response.success) {
        // Remove the moderated article from the list
        setArticles(articles.filter(a => a._id !== articleId));
        closeDialog();
      } else {
        throw new Error(response.message || `Failed to ${moderationAction} article`);
      }
    } catch (err) {
      console.error(`Error ${moderationAction}ing article:`, err);
      setError(err instanceof Error ? err.message : `Failed to ${moderationAction} article`);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeDialog = () => {
    setSelectedArticle(null);
    setModerationAction(null);
    setNotes('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Article Moderation Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-lg">Loading submissions for moderation...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Article Moderation Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading pending articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-green-50 border border-green-100 rounded-md p-4">
            <p className="text-green-800">No pending articles to moderate.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard 
                key={article._id} 
                article={article}
                actions={[
                  { 
                    label: 'Approve', 
                    onClick: () => {
                      setSelectedArticle(article);
                      setModerationAction('approve');
                      setNotes('');
                    },
                    className: 'bg-green-600 hover:bg-green-700'
                  },
                  { 
                    label: 'Reject', 
                    onClick: () => {
                      setSelectedArticle(article);
                      setModerationAction('reject');
                      setNotes('');
                    },
                    className: 'bg-red-600 hover:bg-red-700'
                  }
                ]}
              />
            ))}
          </div>
        )}
        
        {selectedArticle && moderationAction && (
          <ModerationDialog
            type={moderationAction}
            article={selectedArticle}
            notes={notes}
            onNotesChange={setNotes}
            onConfirm={handleConfirmModeration}
            onCancel={closeDialog}
            isLoading={isProcessing}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}